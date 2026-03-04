import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/home/Content';
import  Banner from '../sections/home/Banner';

const pagelocation = "Homepage";

// const NewsTicker = () => (
//   <div
//     style={{
//       position: "sticky",
//       top: 0,
//       zIndex: 1200,
//       width: "100%",
//       background: "linear-gradient(90deg, #007a7e 0%, #1e293b 100%)",
//       color: "#fff",
//       fontWeight: 700,
//       fontSize: "18px",
//       letterSpacing: "0.5px",
//       overflow: "hidden",
//       height: "44px",
//       display: "flex",
//       alignItems: "center",
//       boxShadow: "0 2px 12px rgba(0,122,126,0.10)",
//       borderBottom: "2px solid #00ffe7cc",
//     }}
//   >
//     <div
//       style={{
//         whiteSpace: "nowrap",
//         display: "inline-block",
//         animation: "ticker-scroll 18s linear infinite",
//         paddingLeft: "100%",
//         fontFamily: 'inherit',
//       }}
//     >
//       Become a member at 49rs &nbsp;|&nbsp; ಕೇವಲ 49 ರೂಪಾಯಿಗೆ ವೈದ್ಯಬಂಧು ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ ಪಡೆಯಿರಿ.
//     </div>
//     <style>{`
//       @keyframes ticker-scroll {
//         0% { transform: translateX(0); }
//         100% { transform: translateX(-100%); }
//       }
//     `}</style>
//   </div>
// );

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>VaidyaBandhu - India's Premier All-in-One Healthcare Ecosystem</title>
                    <meta
                        name="description"
                        content="VaidyaBandhu is India's premier all-in-one healthcare ecosystem. Book appointments with top doctors, hospitals, and diagnostics. Save 10% to 40% on treatments, get cashback, and access free surgeries for those in need. Trusted, affordable, and seamless healthcare for everyone."
                    />
                    <link rel="canonical" href="https://www.vaidyabandhu.com/" />
                    {/* Open Graph for social sharing */}
                    <meta property="og:title" content="VaidyaBandhu - India's Premier All-in-One Healthcare Ecosystem" />
                    <meta property="og:description" content="Book appointments with top doctors, hospitals, and diagnostics. Save 10% to 40% on treatments, get cashback, and access free surgeries for those in need." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.vaidyabandhu.com/" />
                    <meta property="og:image" content="https://www.vaidyabandhu.com/preview.png" />
                    {/* Twitter Card */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="VaidyaBandhu - India's Premier All-in-One Healthcare Ecosystem" />
                    <meta name="twitter:description" content="Book appointments with top doctors, hospitals, and diagnostics. Save 10% to 40% on treatments, get cashback, and access free surgeries for those in need." />
                    <meta name="twitter:image" content="https://www.vaidyabandhu.com/preview.png" />
                </Helmet>
                {/* <NewsTicker /> */}
                <Header />
                  <Banner />
                
                <Content />
             
                <Footer />
            </Fragment>
        );
    }
}

export default Home;
