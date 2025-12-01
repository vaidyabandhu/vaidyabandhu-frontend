import { Helmet } from "react-helmet-async"

const PageMetaData = ({ title }) => {
	return (
		<Helmet>
			<title>{title} | Vaidya Bandhu</title>
		</Helmet>
	)
}
export default PageMetaData
