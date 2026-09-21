from django.db.models import (
    F,
    Q,
    Sum,
    Count,
    DecimalField,
    ExpressionWrapper,
)

from rest_framework.response import Response
from rest_framework.views import APIView

from apps.stocks.models import (
    InventoryItem,
    SupplyOrder,
    SupplyOrderItem,
    ProductionOrder,
)


class InventoryReportAPIView(APIView):

    def get(self, request):

        queryset = (
            InventoryItem.objects
            .select_related(
                "fabric",
                "accessory",
                "color",
                "unit",
            )
            .order_by("-id")
        )

        search = request.query_params.get("search")
        material_type = request.query_params.get("material_type")
        low_stock = request.query_params.get("low_stock")

        if search:
            queryset = queryset.filter(
                Q(fabric__identity__icontains=search)
                | Q(accessory__identity__icontains=search)
                | Q(color__identity__icontains=search)
                | Q(unit__code__icontains=search)
            )

        if material_type == "fabric":
            queryset = queryset.filter(
                fabric__isnull=False
            )

        elif material_type == "accessory":
            queryset = queryset.filter(
                accessory__isnull=False
            )

        if low_stock == "true":
            queryset = queryset.filter(
                quantity__lt=100
            )

        total_quantity = (
            queryset.aggregate(
                total=Sum("quantity")
            )["total"]
            or 0
        )

        data = []

        for item in queryset:

            if item.fabric:
                material_type_value = "Fabric"
                material_name = item.fabric.identity
            else:
                material_type_value = "Accessory"
                material_name = item.accessory.identity

            data.append({
                "id": item.id,
                "material_type": material_type_value,
                "material_name": material_name,
                "color": item.color.identity,
                "unit": item.unit.code,
                "quantity": item.quantity,
                "stock_status": (
                    "Low Stock"
                    if item.quantity < 100
                    else "Available"
                ),
            })

        return Response({
            "summary": {
                "total_items": queryset.count(),
                "total_quantity": total_quantity,
                "low_stock_items": queryset.filter(
                    quantity__lt=100
                ).count(),
            },
            "results": data,
        })


class SupplyOrderReportAPIView(APIView):

    def get(self, request):

        queryset = (
            SupplyOrder.objects
            .select_related("supplier")
            .prefetch_related("items")
            .order_by("-id")
        )

        search = request.query_params.get("search")
        status = request.query_params.get("status")
        supplier = request.query_params.get("supplier")

        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search)
                | Q(supplier__identity__icontains=search)
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        if supplier:
            queryset = queryset.filter(
                supplier_id=supplier
            )

        total_orders = queryset.count()

        ordered_quantity = (
            SupplyOrderItem.objects
            .filter(supply_order__in=queryset)
            .aggregate(
                total=Sum("ordered_quantity")
            )["total"]
            or 0
        )

        received_quantity = (
            SupplyOrderItem.objects
            .filter(supply_order__in=queryset)
            .aggregate(
                total=Sum("received_quantity")
            )["total"]
            or 0
        )

        pending_quantity = (
            ordered_quantity - received_quantity
        )

        data = []

        for order in queryset:

            ordered = (
                order.items.aggregate(
                    total=Sum("ordered_quantity")
                )["total"]
                or 0
            )

            received = (
                order.items.aggregate(
                    total=Sum("received_quantity")
                )["total"]
                or 0
            )

            pending = ordered - received

            data.append({
                "id": order.id,
                "order_number": order.order_number,
                "supplier": (
                    order.supplier.identity
                    if order.supplier
                    else "-"
                ),
                "order_date": order.order_date,
                "status": order.status,
                "ordered_quantity": ordered,
                "received_quantity": received,
                "pending_quantity": pending,
                "notes": order.notes,
            })

        return Response({
            "summary": {
                "total_orders": total_orders,
                "ordered_quantity": ordered_quantity,
                "received_quantity": received_quantity,
                "pending_quantity": pending_quantity,
            },
            "results": data,
        })


class ProductionReportAPIView(APIView):

    def get(self, request):

        queryset = (
            ProductionOrder.objects
            .select_related("product")
            .order_by("-id")
        )

        search = request.query_params.get("search")
        status = request.query_params.get("status")
        production_line = request.query_params.get(
            "production_line"
        )
        product = request.query_params.get("product")

        if search:
            queryset = queryset.filter(
                Q(production_no__icontains=search)
                | Q(product__bom_number__icontains=search)
                | Q(product__identity__icontains=search)
                | Q(
                    production_line__icontains=search
                )
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        if production_line:
            queryset = queryset.filter(
                production_line__icontains=production_line
            )

        if product:
            queryset = queryset.filter(
                product_id=product
            )

        status_summary = {
            item["status"]: item["count"]
            for item in (
                queryset
                .values("status")
                .annotate(count=Count("id"))
            )
        }

        total_quantity = (
            queryset.aggregate(
                total=Sum("quantity")
            )["total"]
            or 0
        )

        data = []

        for order in queryset:

            data.append({
                "id": order.id,
                "production_no": order.production_no,
                "product": (
                    order.product.identity
                    if order.product
                    else "-"
                ),
                "bom_number": (
                    order.product.bom_number
                    if order.product
                    else "-"
                ),
                "quantity": order.quantity,
                "production_line": order.production_line,
                "status": order.status,
                "status_display": (
                    order.get_status_display()
                ),
                "cutting_date": order.cutting_date,
                "stitching_date": order.stitching_date,
                "sewing_date": order.sewing_date,
                "finishing_date": order.finishing_date,
                "completed_date": order.completed_date,
                "cancelled_date": order.cancelled_date,
                "remarks": order.remarks,
                "created_at": order.created_at,
            })

        return Response({
            "summary": {
                "total_orders": queryset.count(),
                "total_quantity": total_quantity,
                "status": status_summary,
            },
            "results": data,
        })