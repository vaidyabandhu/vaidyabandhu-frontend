import {
	Dropdown,
	DropdownDivider,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react';
import { useAuthContext } from '../../../context';

const isProfileActive = (profile = {}) => {
	const payload = profile?.data && typeof profile.data === "object" ? profile.data : profile;
	const primary =
		payload?.primary_member && typeof payload.primary_member === "object"
			? payload.primary_member
			: payload?.primaryMember && typeof payload.primaryMember === "object"
				? payload.primaryMember
				: {};

	const rawStatus =
		primary.is_active ??
		primary.active ??
		primary.isActive ??
		primary.membership_active ??
		payload.is_active ??
		payload.active ??
		payload.isActive ??
		payload.membership_active ??
		primary.status ??
		payload.status;

	if (typeof rawStatus === "boolean") return rawStatus;
	if (typeof rawStatus === "number") return rawStatus === 1;
	if (typeof rawStatus === "string") {
		const normalized = rawStatus.trim().toLowerCase();
		if (["true", "1", "active", "paid", "captured", "verified", "success", "completed", "enabled", "activated"].includes(normalized)) {
			return true;
		}
		if (["false", "0", "inactive", "pending", "failed", "cancelled", "disabled"].includes(normalized)) {
			return false;
		}
	}
	return false;
};


const ProfileDropdown = () => {
	const { user } = useAuthContext()

	const navigate = useNavigate()
	
	const handleProfileClick = () => {
		try {
			const userData = localStorage.getItem("userData");
			console.log("userData from localStorage:", userData);
			
			if (!userData) {
				console.log("No userData found, redirecting to basic-details");
				navigate('/basic-details');
				return;
			}
			
			const parsed = JSON.parse(userData);
			console.log("Parsed userData:", parsed);
			console.log("is_active value:", parsed?.is_active);
			console.log("primary_member:", parsed?.primary_member);
			
			// Check if primary member is active
				const isActive = isProfileActive(parsed);
			
			console.log("isActive:", isActive);
			
			if (isActive) {
				console.log("Active - navigating to /myprofile");
				navigate('/myprofile');
			} else {
				console.log("Inactive - navigating to /basic-details");
				navigate('/basic-details');
			}
		} catch (err) {
			console.error("Error reading userData for profile navigation", err);
			navigate('/basic-details');
		}
	}
	
	const logout = () => {
		navigate('/logout')
	}	
	return (
		<Dropdown>
			<DropdownToggle as="a" className="nav-link nav-user d-flex align-items-center" role="button">
				<div className="d-flex align-items-center">
					<User className="thumb-sm" />
					<div>
						{/* <small className="d-none d-md-block font-11">
							{user?.user_type}
						</small> */}
						<span className="d-none d-md-block fw-semibold font-12">
							{user?.full_name} <i className="mdi mdi-chevron-down" />
						</span>
					</div>
				</div>
			</DropdownToggle>
			<DropdownMenu align="end">
				{/* <DropdownItem href="#" onClick={handleProfileClick}>
					<i className="ti ti-user font-16 me-1 align-text-bottom" /> Profile
				</DropdownItem> */}
				{/* <DropdownItem href="#">
					<i className="ti ti-settings font-16 me-1 align-text-bottom" />{' '}
					Settings
				</DropdownItem> */}
				{/* <DropdownDivider className="mb-0" /> */}
				<DropdownItem onClick={() => logout()} href="#">
					<i className="ti ti-power font-16 me-1 align-text-bottom" /> Logout
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
export default ProfileDropdown
