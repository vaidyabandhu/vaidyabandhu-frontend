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


const ProfileDropdown = () => {
	const { user } = useAuthContext()

	const navigate = useNavigate()
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
				<DropdownItem href="#" onClick={() => navigate('/doctorprofile')}>
					<i className="ti ti-user font-16 me-1 align-text-bottom" /> Profile
				</DropdownItem>
				{/* <DropdownItem href="#">
					<i className="ti ti-settings font-16 me-1 align-text-bottom" />{' '}
					Settings
				</DropdownItem> */}
				<DropdownDivider className="mb-0" />
				<DropdownItem onClick={() => logout()} href="#">
					<i className="ti ti-power font-16 me-1 align-text-bottom" /> Logout
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
export default ProfileDropdown
