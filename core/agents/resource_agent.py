"""
CAMPUS ORBIT - Resource Agent
Monitors equipment inventory, tracks live allocations, detects supply shortages,
and provides intelligent inter-department borrowing or rental recommendations.
"""

from typing import List, Dict, Any, Tuple
from ..models import ResourceItem, ParsedRequirement
from ..database import db
import copy


class ResourceAgent:
    """
    Agent responsible for hardware, AV, network switches, laptops, and furniture inventory.
    """

    def __init__(self):
        self.name = "Campus Resource & Equipment Agent"

    def allocate_resources(self, req: ParsedRequirement) -> List[ResourceItem]:
        """
        Maps requested equipment to campus inventory and flags any shortages.
        """
        resources = copy.deepcopy(db.resources)

        # Dynamic allocation heuristics based on requirements
        req_pax = req.participants
        
        for r in resources:
            if r.id == "RES-PRJ":  # Projectors
                needed = 4 if req_pax > 200 else 2
                r.allocated_qty = needed
                r.available_qty = max(0, r.total_qty - needed)
                if needed > r.total_qty:
                    r.shortage_qty = needed - r.total_qty
                    r.ai_recommendation = f"Borrow {r.shortage_qty} projector(s) from ECE Department Media Store."
                else:
                    r.shortage_qty = 0
                    r.ai_recommendation = "All requested projectors successfully allocated from central pool."

            elif r.id == "RES-MIC":  # Microphones
                needed = 6 if req_pax > 200 else 3
                r.allocated_qty = min(r.total_qty, needed)
                r.available_qty = r.total_qty - r.allocated_qty
                r.shortage_qty = max(0, needed - r.total_qty)
                r.ai_recommendation = "Wireless collar and handheld microphones verified."

            elif r.id == "RES-LAP":  # Laptops
                needed = min(r.total_qty, req_pax // 3)
                r.allocated_qty = needed
                r.available_qty = r.total_qty - needed
                r.shortage_qty = 0
                r.ai_recommendation = "Workstation terminals pre-imaged with hackathon SDKs."

            elif r.id == "RES-EXT":  # Power Extension Boards
                needed = min(30, max(10, req_pax // 10))
                r.allocated_qty = needed
                r.available_qty = r.total_qty - needed
                r.shortage_qty = 0
                r.ai_recommendation = "Heavy-duty surge protected spike strips allocated across lab tables."

            elif r.id == "RES-WIF":  # Wi-Fi Routers
                needed = 6
                r.allocated_qty = needed
                r.available_qty = r.total_qty - needed
                r.shortage_qty = 0
                r.ai_recommendation = "High QoS bandwidth allocated with dedicated campus SSID."

        return resources
