"""
Human-in-the-Loop (HITL) Approval & Governance Agent:
Enforces strict institutional policy gates for financial disbursements,
overnight campus permissions, VIP protocol clearances, and high-risk operations.
"""

from datetime import datetime
from typing import List, Optional
from ..models import (
    ParsedRequirement, ApprovalItem, ApprovalStatus, Venue
)
from ..knowledge_base import GOVERNANCE_POLICIES


class ApprovalGovernanceAgent:
    """
    Agent responsible for identifying high-stakes, security-sensitive, or financially significant
    aspects of the event plan, generating approval tickets, and tracking digital human sign-offs.
    """

    def __init__(self):
        self.name = "Governance & Human Approval Gatekeeper"

    def evaluate_required_approvals(
        self,
        req: ParsedRequirement,
        venues: List[Venue],
        estimated_cost: float
    ) -> List[ApprovalItem]:
        """
        Generates mandatory governance approval tickets based on policy thresholds.
        """
        approvals: List[ApprovalItem] = []
        counter = 1
        venue_names = ", ".join(v.name for v in venues)

        # 1. Primary Venue Reservation Clearance
        approvals.append(ApprovalItem(
            id=f"APP-{counter:03d}",
            category="VENUE_PERMIT",
            title=f"Official Venue Allocation Clearance ({venue_names})",
            approver_role="Estate Officer & Registrar",
            description=f"Formal institutional sanction to reserve {venue_names} from {req.start_date} ({req.start_time}) to {req.end_date} ({req.end_time}).",
            financial_impact=estimated_cost * 0.3,
            status=ApprovalStatus.PENDING,
            is_blocking=True
        ))
        counter += 1

        # 2. Budget Allocation & Financial Sanction
        effective_budget = max(estimated_cost, req.budget_limit)
        if effective_budget >= GOVERNANCE_POLICIES["budget_threshold_finance_approval"]:
            approvals.append(ApprovalItem(
                id=f"APP-{counter:03d}",
                category="BUDGET",
                title="Institutional High-Value Budget Sanction",
                approver_role="Chief Finance Officer (CFO)",
                description=f"Event budget (${effective_budget:,.2f}) exceeds $3,000 threshold. Requires CFO financial grant authorization.",
                financial_impact=effective_budget,
                status=ApprovalStatus.PENDING,
                is_blocking=True
            ))
            counter += 1
        elif effective_budget >= GOVERNANCE_POLICIES["budget_threshold_dean_approval"]:
            approvals.append(ApprovalItem(
                id=f"APP-{counter:03d}",
                category="BUDGET",
                title="Dean Student Welfare Budget Endorsement",
                approver_role="Dean of Student Welfare (DSW)",
                description=f"Event budget (${effective_budget:,.2f}) requires DSW operational budget sanction.",
                financial_impact=effective_budget,
                status=ApprovalStatus.PENDING,
                is_blocking=True
            ))
            counter += 1

        # 3. Overnight Campus Access & Security Gate Pass
        if req.overnight_access:
            approvals.append(ApprovalItem(
                id=f"APP-{counter:03d}",
                category="SECURITY",
                title="Overnight Campus Operation & Hostel Curfew Waiver",
                approver_role="Chief Security Officer & Chief Warden",
                description="Permission for student participants and mentors to remain active in campus labs overnight beyond 21:00 curfew with dedicated night patrol.",
                financial_impact=0.0,
                status=ApprovalStatus.PENDING,
                is_blocking=True
            ))
            counter += 1

        # 4. VIP Dignitary Protocol & External Guest Clearance
        if req.external_guests_vip:
            approvals.append(ApprovalItem(
                id=f"APP-{counter:03d}",
                category="VIP_CLEARANCE",
                title="VIP Dignitary Security & Protocol Sanction",
                approver_role="Campus Director / Public Relations Office",
                description="Security protocol clearance and VIP lounge access for external keynote speakers and corporate dignitaries.",
                financial_impact=200.0,
                status=ApprovalStatus.PENDING,
                is_blocking=True
            ))
            counter += 1

        # 5. Outdoor Sound Amplification & Generator Permit
        if req.sound_amplification_outdoor or req.heavy_power_needed:
            approvals.append(ApprovalItem(
                id=f"APP-{counter:03d}",
                category="ESTATE",
                title="High-Decibel Sound & Power Load Grid Permit",
                approver_role="Chief Electrical & Maintenance Engineer",
                description="Clearance for high-power sound line arrays and mobile 50 kVA diesel generator synchronization.",
                financial_impact=150.0,
                status=ApprovalStatus.PENDING,
                is_blocking=False
            ))
            counter += 1

        return approvals

    def process_signoff(
        self,
        approvals: List[ApprovalItem],
        approval_id: str,
        approver_name: str,
        action: str,  # "APPROVED" or "REJECTED"
        comments: str = ""
    ) -> bool:
        """
        Records a human sign-off on a pending approval ticket.
        """
        for item in approvals:
            if item.id == approval_id:
                item.status = ApprovalStatus.APPROVED if action.upper() == "APPROVED" else ApprovalStatus.REJECTED
                item.approver_name = approver_name
                item.approval_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                item.comments = comments
                return True
        return False
