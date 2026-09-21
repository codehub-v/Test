from django.db.models import Count, Sum
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.stocks.models import (
    InventoryItem,
    ProductionOrder,
    SupplyOrder,
)


class DashboardAPIView(APIView):

    def get(self, request):

        total_supply_orders = SupplyOrder.objects.count()
        total_production_orders = ProductionOrder.objects.count()

        total_quantity = (
            InventoryItem.objects.aggregate(
                total=Sum("quantity")
            )["total"]
            or 0
        )

        low_stock_items = InventoryItem.objects.filter(
            quantity__lt=100
        ).count()

        supply_status = {
            item["status"]: item["count"]
            for item in SupplyOrder.objects.values("status").annotate(
                count=Count("id")
            )
        }

        production_status = {
            item["status"]: item["count"]
            for item in ProductionOrder.objects.values("status").annotate(
                count=Count("id")
            )
        }

        return Response({
            "summary": {
                "total_supply_orders": total_supply_orders,
                "total_production_orders": total_production_orders,
            },

            "inventory": {
                "total_quantity": total_quantity,
                "low_stock_items": low_stock_items,
            },

            "supply_orders": {
                "ordered": supply_status.get("ordered", 0),
                "partial": supply_status.get("partial", 0),
                "received": supply_status.get("received", 0),
            },

            "production": {
                "waiting": production_status.get("WAITING", 0),
                "cutting": production_status.get("CUTTING", 0),
                "stitching": production_status.get("STITCHING", 0),
                "sewing": production_status.get("SEWING", 0),
                "finishing": production_status.get("FINISHING", 0),
                "completed": production_status.get("COMPLETED", 0),
                "cancelled": production_status.get("CANCELLED", 0),
            },
        })