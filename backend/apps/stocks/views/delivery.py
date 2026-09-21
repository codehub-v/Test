from django.db import models, transaction

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.stocks.models import Delivery
from apps.stocks.serializers import (
    DeliveryListSerializer,
    DeliveryRetrieveSerializer,
    DeliveryWriteSerializer,
)


class DeliveryViewSet(ModelViewSet):

    queryset = Delivery.objects.select_related(
        "production_order",
        "production_order__customer",
        "production_order__product",
    )

    def get_serializer_class(self):

        if self.action == "list":
            return DeliveryListSerializer

        if self.action == "retrieve":
            return DeliveryRetrieveSerializer

        return DeliveryWriteSerializer

    @transaction.atomic
    def perform_create(self, serializer):

        production_order = serializer.validated_data[
            "production_order"
        ]

        # Delivery is allowed only for completed production
        if production_order.status != production_order.Status.COMPLETED:
            raise ValidationError(
                "Delivery can be created only for completed production orders."
            )

        quantity = serializer.validated_data["quantity"]

        # Calculate already delivered quantity
        delivered_quantity = (
            Delivery.objects
            .filter(
                production_order=production_order,
                status__in=[
                    Delivery.Status.PACKED,
                    Delivery.Status.DISPATCHED,
                    Delivery.Status.DELIVERED,
                ],
            )
            .aggregate(
                total=models.Sum("quantity")
            )["total"]
            or 0
        )

        remaining_quantity = (
            production_order.quantity - delivered_quantity
        )

        if quantity > remaining_quantity:
            raise ValidationError(
                f"Only {remaining_quantity} quantity is available "
                f"for delivery."
            )

        serializer.save(
            status=Delivery.Status.PACKED
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="dispatch"
    )
    @transaction.atomic
    def dispatch_delivery(self, request, pk=None):

        delivery = self.get_object()

        if delivery.status != Delivery.Status.PACKED:
            raise ValidationError(
                "Only packed deliveries can be dispatched."
            )

        delivery.status = Delivery.Status.DISPATCHED
        delivery.save()

        return Response(
            {
                "message": "Delivery dispatched successfully.",
                "status": delivery.status,
            },
            status=status.HTTP_200_OK
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="completed"
    )
    @transaction.atomic
    def complete_delivery(self, request, pk=None):

        delivery = self.get_object()

        if delivery.status != Delivery.Status.DISPATCHED:
            raise ValidationError(
                "Only dispatched deliveries can be marked as delivered."
            )

        delivery.status = Delivery.Status.DELIVERED
        delivery.save()

        return Response(
            {
                "message": "Delivery completed successfully.",
                "status": delivery.status,
            },
            status=status.HTTP_200_OK
        )
        
        
        