from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.master.models import (
    Color,
    Customer,
    Fabric,
    Size,
    Style,
    Supplier,
    Unit,
    Season,
    Accessory,
    BOM,
    BOMItem,
)

from apps.stocks.models import (
    InventoryItem,
    StockTransaction,
    SupplyOrder,
    SupplyOrderItem,
    ProductionOrder,
)

class Command(BaseCommand):

    help = "Create demo data for the garment ERP"

    @transaction.atomic
    def handle(self, *args, **options):

        self.stdout.write("Creating demo data...")

        colors = self.create_colors()
        customers = self.create_customers()
        fabrics = self.create_fabrics()
        sizes = self.create_sizes()
        styles = self.create_styles()
        suppliers = self.create_suppliers()
        units = self.create_units()
        seasons = self.create_seasons()
        accessories = self.create_accessories()

        boms = self.create_boms(
            fabrics=fabrics,
            accessories=accessories,
            colors=colors,
            units=units,
        )

        inventory = self.create_inventory(
            fabrics=fabrics,
            accessories=accessories,
            colors=colors,
            units=units,
        )

        supply_orders = self.create_supply_orders(
            suppliers=suppliers,
            fabrics=fabrics,
            accessories=accessories,
            colors=colors,
            units=units,
        )

        self.create_stock_transactions(inventory)

        production_orders = self.create_production_orders(
            boms=boms,
            customers=customers,
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Demo data created successfully."
            )
        )

        self.stdout.write(f"Colors: {len(colors)}")
        self.stdout.write(f"Customers: {len(customers)}")
        self.stdout.write(f"Fabrics: {len(fabrics)}")
        self.stdout.write(f"Sizes: {len(sizes)}")
        self.stdout.write(f"Styles: {len(styles)}")
        self.stdout.write(f"Suppliers: {len(suppliers)}")
        self.stdout.write(f"Units: {len(units)}")
        self.stdout.write(f"Seasons: {len(seasons)}")
        self.stdout.write(f"Accessories: {len(accessories)}")
        self.stdout.write(f"BOMs: {len(boms)}")
        self.stdout.write(f"Inventory Items: {len(inventory)}")
        self.stdout.write(f"Supply Orders: {len(supply_orders)}")
        self.stdout.write(
            f"Stock Transactions: {StockTransaction.objects.count()}"
        )
        self.stdout.write(
            f"Production Orders: {len(production_orders)}"
        )


    def create_colors(self):

            data = [
                ("Black", "BLK"),
                ("White", "WHT"),
                ("Red", "RED"),
                ("Blue", "BLU"),
                ("Navy Blue", "NVY"),
                ("Green", "GRN"),
                ("Yellow", "YLW"),
                ("Orange", "ORG"),
                ("Pink", "PNK"),
                ("Purple", "PUR"),
                ("Grey", "GRY"),
                ("Brown", "BRN"),
                ("Beige", "BEG"),
                ("Maroon", "MAR"),
                ("Sky Blue", "SKY"),
            ]

            return [
                Color.objects.get_or_create(
                    code=code,
                    defaults={
                        "identity": name,
                        "is_active": True,
                    },
                )[0]
                for name, code in data
            ]

    def create_customers(self):

        data = [
            ("Fashion Hub", "fashionhub@example.com", "9876500001"),
            ("Style World", "styleworld@example.com", "9876500002"),
            ("Urban Wear", "urbanwear@example.com", "9876500003"),
            ("Trend House", "trendhouse@example.com", "9876500004"),
            ("Cotton Club", "cottonclub@example.com", "9876500005"),
            ("Elite Fashion", "elitefashion@example.com", "9876500006"),
            ("Modern Threads", "modernthreads@example.com", "9876500007"),
            ("Classic Wear", "classicwear@example.com", "9876500008"),
            ("Fashion Point", "fashionpoint@example.com", "9876500009"),
            ("Royal Garments", "royalgarments@example.com", "9876500010"),
            ("Metro Fashion", "metrofashion@example.com", "9876500011"),
            ("Daily Wear", "dailywear@example.com", "9876500012"),
            ("Premium Cloths", "premiumcloths@example.com", "9876500013"),
            ("Fashion Mart", "fashionmart@example.com", "9876500014"),
            ("Garment House", "garmenthouse@example.com", "9876500015"),
        ]

        return [
            Customer.objects.get_or_create(
                email=email,
                defaults={
                    "identity": name,
                    "phone": phone,
                    "address": f"{name} Main Road",
                    "city": "Chennai",
                    "pincode": "600001",
                    "is_active": True,
                },
            )[0]
            for name, email, phone in data
        ]

    def create_fabrics(self):

        data = [
            ("Cotton Single Jersey", "FAB001"),
            ("Cotton Interlock", "FAB002"),
            ("Polyester Jersey", "FAB003"),
            ("Poly Cotton", "FAB004"),
            ("Linen Blend", "FAB005"),
            ("Rayon", "FAB006"),
            ("Viscose", "FAB007"),
            ("Denim", "FAB008"),
            ("Twill", "FAB009"),
            ("Pique", "FAB010"),
            ("Fleece", "FAB011"),
            ("French Terry", "FAB012"),
            ("Poplin", "FAB013"),
            ("Oxford", "FAB014"),
            ("Lycra Blend", "FAB015"),
        ]

        return [
            Fabric.objects.get_or_create(
                code=code,
                defaults={
                    "identity": name,
                    "is_active": True,
                },
            )[0]
            for name, code in data
        ]

    def create_sizes(self):

        data = [
            ("Extra Small", "XS"),
            ("Small", "S"),
            ("Medium", "M"),
            ("Large", "L"),
            ("Extra Large", "XL"),
            ("2 Extra Large", "XXL"),
            ("3 Extra Large", "3XL"),
            ("4 Extra Large", "4XL"),
            ("28", "SZ28"),
            ("30", "SZ30"),
            ("32", "SZ32"),
            ("34", "SZ34"),
            ("36", "SZ36"),
            ("38", "SZ38"),
            ("40", "SZ40"),
        ]

        return [
            Size.objects.get_or_create(
                code=code,
                defaults={
                    "identity": name,
                    "is_active": True,
                },
            )[0]
            for name, code in data
        ]

    def create_styles(self):

        data = [
            ("Classic T-Shirt", "STY001"),
            ("Slim Fit T-Shirt", "STY002"),
            ("Regular Polo", "STY003"),
            ("Slim Polo", "STY004"),
            ("Casual Shirt", "STY005"),
            ("Formal Shirt", "STY006"),
            ("Oversized T-Shirt", "STY007"),
            ("Round Neck T-Shirt", "STY008"),
            ("V-Neck T-Shirt", "STY009"),
            ("Hoodie", "STY010"),
            ("Sweatshirt", "STY011"),
            ("Jogger", "STY012"),
            ("Cargo Pant", "STY013"),
            ("Denim Shirt", "STY014"),
            ("Track Pant", "STY015"),
        ]

        return [
            Style.objects.get_or_create(
                code=code,
                defaults={
                    "identity": name,
                    "is_active": True,
                },
            )[0]
            for name, code in data
        ]

    def create_suppliers(self):

        data = [
            ("ABC Textiles", "abc@example.com", "9876510001"),
            ("Prime Fabrics", "prime@example.com", "9876510002"),
            ("Sri Textiles", "sri@example.com", "9876510003"),
            ("Metro Fabrics", "metrofab@example.com", "9876510004"),
            ("Royal Textiles", "royaltextile@example.com", "9876510005"),
            ("Classic Fabrics", "classicfab@example.com", "9876510006"),
            ("Best Threads", "bestthreads@example.com", "9876510007"),
            ("Fine Fabrics", "finefab@example.com", "9876510008"),
            ("Global Textiles", "globaltextile@example.com", "9876510009"),
            ("Cotton Suppliers", "cottonsupplier@example.com", "9876510010"),
            ("Fashion Fabrics", "fashionfab@example.com", "9876510011"),
            ("Modern Textiles", "moderntextile@example.com", "9876510012"),
            ("Elite Suppliers", "elitesupplier@example.com", "9876510013"),
            ("South Textiles", "southtextile@example.com", "9876510014"),
            ("Premium Suppliers", "premiumsupplier@example.com", "9876510015"),
        ]

        return [
            Supplier.objects.get_or_create(
                email=email,
                defaults={
                    "identity": name,
                    "phone": phone,
                    "address": f"{name} Industrial Area",
                    "city": "Tiruppur",
                    "pincode": "641601",
                    "is_active": True,
                },
            )[0]
            for name, email, phone in data
        ]

    def create_units(self):

        data = [
            ("Meter", "MTR"),
            ("Kilogram", "KG"),
            ("Gram", "GM"),
            ("Piece", "PCS"),
            ("Dozen", "DOZ"),
            ("Yard", "YRD"),
            ("Centimeter", "CM"),
            ("Inch", "IN"),
            ("Roll", "ROLL"),
            ("Box", "BOX"),
            ("Packet", "PKT"),
            ("Bundle", "BDL"),
            ("Pair", "PAIR"),
            ("Set", "SET"),
            ("Litre", "LTR"),
        ]

        return [
            Unit.objects.get_or_create(
                code=code,
                defaults={
                    "identity": name,
                    "is_active": True,
                },
            )[0]
            for name, code in data
        ]

    def create_seasons(self):

        data = [
            ("Spring 2026", "SPR26"),
            ("Summer 2026", "SUM26"),
            ("Monsoon 2026", "MON26"),
            ("Autumn 2026", "AUT26"),
            ("Winter 2026", "WIN26"),
            ("Spring 2027", "SPR27"),
            ("Summer 2027", "SUM27"),
            ("Monsoon 2027", "MON27"),
            ("Autumn 2027", "AUT27"),
            ("Winter 2027", "WIN27"),
            ("Festive 2026", "FST26"),
            ("Festive 2027", "FST27"),
            ("Holiday 2026", "HOL26"),
            ("Holiday 2027", "HOL27"),
            ("All Season", "ALL"),
        ]

        return [
            Season.objects.get_or_create(
                code=code,
                defaults={
                    "identity": name,
                    "is_active": True,
                },
            )[0]
            for name, code in data
        ]

    def create_accessories(self):

        data = [
            ("Plastic Button", "ACC001"),
            ("Metal Button", "ACC002"),
            ("Snap Button", "ACC003"),
            ("Zipper 5 Inch", "ACC004"),
            ("Zipper 7 Inch", "ACC005"),
            ("Zipper 10 Inch", "ACC006"),
            ("Cotton Label", "ACC007"),
            ("Size Label", "ACC008"),
            ("Care Label", "ACC009"),
            ("Hang Tag", "ACC010"),
            ("Elastic Tape", "ACC011"),
            ("Draw Cord", "ACC012"),
            ("Poly Thread", "ACC013"),
            ("Cotton Thread", "ACC014"),
            ("Brand Label", "ACC015"),
        ]

        return [
            Accessory.objects.get_or_create(
                code=code,
                defaults={
                    "identity": name,
                    "is_active": True,
                },
            )[0]
            for name, code in data
        ]

    def create_boms(
        self,
        fabrics,
        accessories,
        colors,
        units,
    ):

        boms = []

        for index in range(15):

            bom, _ = BOM.objects.get_or_create(
                identity=f"Production BOM {index + 1}",
                defaults={
                    "status": "active",
                    "notes": (
                        f"Demo BOM for garment product "
                        f"{index + 1}"
                    ),
                },
            )

            boms.append(bom)

            BOMItem.objects.get_or_create(
                bom=bom,
                fabric=fabrics[index],
                accessory=None,
                color=colors[index],
                unit=units[0],
                defaults={
                    "quantity": Decimal("1.50"),
                },
            )

            BOMItem.objects.get_or_create(
                bom=bom,
                fabric=None,
                accessory=accessories[index],
                color=colors[index],
                unit=units[3],
                defaults={
                    "quantity": Decimal("2.00"),
                },
            )

        return boms

    def create_inventory(
        self,
        fabrics,
        accessories,
        colors,
        units,
    ):

        inventory = []

        for index in range(15):

            fabric_inventory, _ = InventoryItem.objects.get_or_create(
                fabric=fabrics[index],
                accessory=None,
                color=colors[index],
                unit=units[0],
                defaults={
                    "quantity": Decimal(
                        100 + (index * 25)
                    ),
                    "is_active": True,
                },
            )

            inventory.append(fabric_inventory)

            accessory_inventory, _ = InventoryItem.objects.get_or_create(
                fabric=None,
                accessory=accessories[index],
                color=colors[index],
                unit=units[3],
                defaults={
                    "quantity": Decimal(
                        500 + (index * 50)
                    ),
                    "is_active": True,
                },
            )

            inventory.append(accessory_inventory)

        return inventory



    def create_supply_orders(
        self,
        suppliers,
        fabrics,
        accessories,
        colors,
        units,
    ):

        orders = []

        statuses = [
            "ordered",
            "received",
        ]

        for index in range(15):

            order, _ = SupplyOrder.objects.get_or_create(
                order_number=f"PO-{index + 1:05d}",
                defaults={
                    "supplier": suppliers[index],
                    "order_date": date.today() - timedelta(days=index),
                    "status": statuses[index % len(statuses)],
                    "notes": (
                        f"Demo supply order {index + 1}"
                    ),
                },
            )

            orders.append(order)

            SupplyOrderItem.objects.get_or_create(
                supply_order=order,
                fabric=fabrics[index],
                accessory=None,
                color=colors[index],
                unit=units[0],
                defaults={
                    "ordered_quantity": Decimal("500.00"),
                    "received_quantity": (
                        Decimal("500.00")
                        if order.status == "received"
                        else Decimal("0.00")
                    ),
                },
            )

            SupplyOrderItem.objects.get_or_create(
                supply_order=order,
                fabric=None,
                accessory=accessories[index],
                color=colors[index],
                unit=units[3],
                defaults={
                    "ordered_quantity": Decimal("1000.00"),
                    "received_quantity": (
                        Decimal("1000.00")
                        if order.status == "received"
                        else Decimal("0.00")
                    ),
                },
            )

        return orders

    def create_stock_transactions(self, inventory):

        for index, item in enumerate(inventory):

            quantity = item.quantity

            exists = StockTransaction.objects.filter(
                item=item,
                transaction_in=quantity,
                transaction_out=Decimal("0.00"),
            ).exists()

            if exists:
                continue

            StockTransaction.objects.create(
                item=item,
                transaction_in=quantity,
                transaction_out=Decimal("0.00"),
                quantity=quantity,
                notes="Initial demo stock",
            )

    def create_production_orders(self, boms, customers):

        production_orders = []

        statuses = [
            ProductionOrder.Status.WAITING,
            ProductionOrder.Status.CUTTING,
            ProductionOrder.Status.STITCHING,
            ProductionOrder.Status.SEWING,
            ProductionOrder.Status.FINISHING,
            ProductionOrder.Status.COMPLETED,
            ProductionOrder.Status.CANCELLED,
        ]

        for index in range(15):

            status = statuses[index % len(statuses)]

            production, created = ProductionOrder.objects.get_or_create(
                production_no=f"PROD-{index + 1:05d}",
                defaults={
                    "product": boms[index],
                    "customer": customers[index],
                    "quantity": 100 + (index * 25),
                    "production_line": (
                        f"Production Line {(index % 5) + 1}"
                    ),
                    "status": status,
                    "remarks": (
                        f"Demo production order {index + 1}"
                    ),
                },
            )

            production_orders.append(production)

        return production_orders