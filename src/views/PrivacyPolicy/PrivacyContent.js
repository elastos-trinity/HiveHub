import React from "react"
import {makeStyles} from "@material-ui/core/styles"

export default function PrivacyContent(props) {

    const useStyles = makeStyles({
        content: {
            paddingBottom: "30px",

            '& section': {
                margin: "20px 0"
            },

            '& table': {
                border: "1px solid gray",
                borderCollapse: "collapse",
            },

            '& th': {
                border: "1px solid gray",
                padding: "5px"
            },

            '& td': {
                border: "1px solid gray",
                padding: "5px"
            },

            '& p': {
                fontSize: "16px",
            }

        },

        sectionTitle: {
            fontWeight: "800",
            fontSize: "16px"
        }
    });
    const classes = useStyles()

    return (
        <div className={classes.content}>
            <section>
                <p>Trinity Tech Co., Ltd. and its affiliates (“Trinity”, “we”, or “us”), as the owner and operator of
                    its applications, platforms, websites and services (the “Products”), has made every effort to
                    provide accurate information; however, errors or omissions may occur. Trinity expressly disclaims,
                    and will take no responsibility, for any errors, omissions or for the results obtained from using
                    the information provided in the Products or through any correspondence through its domain, emails,
                    newsletters, content distribution platforms or similar mediums. All information on the Products or
                    sent through any medium is provided "as is," with no express or implied warranties. By using the
                    Products, you also agree to be bound by the Terms and Conditions which are hereby incorporated by
                    reference and can be found on each of the Products.</p>
                <p>Trinity deeply respects your concerns for privacy, and understands that crypto-currency and its
                    community is built around security and privacy. Therefore, this privacy policy (“Privacy Policy”)
                    describes the type of information we collect, how we use this information and whom we share it.
                    Based on the services we provide and in accordance with the EU General Data Protection Regulation
                    (“GDPR”), we may be deemed, depending on the Product, both a data processor and a data collector.
                    The phrase “personal information” refers to information by which you or the device you are using to
                    connect to the Internet can be identified. If at any point you have any questions or privacy
                    requests regarding this Privacy Policy please contact us via email at the address listed in Section
                    10. Contact Information.</p>
            </section>


            <section>
                <p className={classes.sectionTitle}>1. PURPOSE, USE AND PROCESSING OF YOUR PERSONAL INFORMATION.</p>

                <p>Trinity’s vision for Elastos Essentials and the Products are to develop a low barrier entry to the
                    new Elastos decentralized internet and framework to run dApps on the Elastos blockchain framework.
                    With that vision in mind, Trinity may use your personal information to tailor and continue to
                    develop the Products to drive the growth of the new internet and development of dApps on the Elastos
                    blockchain framework.</p>

                <p>In addition to our main vision statement, we may use your personal information, sometimes combined
                    with non-personal information, in the following ways:</p>

                <div>
                    <ul>
                        <li>To identify you when you visit and use the Products.</li>
                        <li>To provide the products, information, and/or services you request.</li>
                        <li>To improve and personalize your experience with us.</li>
                        <li>To conduct analytics and solve problems.</li>
                        <li>To respond to your inquiries related to development support, tasks, projects, employment, or
                            other requests.
                        </li>
                        <li>To send marketing and promotional materials, including information relating to our platform,
                            products, services, newsletters, or tips.
                        </li>
                        <li>In some instances, to provide you with advertisements.</li>
                        <li>For internal administrative purposes, as well as to manage our relationship with you.</li>
                    </ul>
                </div>
            </section>

            <section>
                <p className={classes.sectionTitle}>2. TYPES OF Information WE COLLECT.</p>

                <p>Personal Information means information that allows someone to identify or contact you. Non-personal
                    information means information that does not directly identify you. We collect both types of
                    information about you.</p>
                <p>The following provides examples of the types of data that we collect from you and how we use the
                    information.</p>
                <div>
                    <table>
                        <tr>
                            <th>Context</th>
                            <th>Types of Data and Purpose for Collection</th>
                        </tr>
                        <tr>
                            <td>Account Registration</td>
                            <td>We may collect your name, DID, and contact information when you create an account.</td>
                        </tr>
                        <tr>
                            <td>Demographic Information</td>
                            <td>We may collect personal information from you, such as your age or location.</td>
                        </tr>
                        <tr>
                            <td>Experience, Skill Sets and Languages</td>
                            <td>You may provide and have us collect personal information regarding your experience and
                                employment for certain subject matter knowledge, skill sets and spoken languages for
                                Elastos and any other blockchain frameworks.
                            </td>
                        </tr>
                        <tr>
                            <td>Email Interconnectivity</td>
                            <td>If you receive email from us, we may use certain tools to capture data related to when
                                you open our message or click on any links or banners it contains.
                            </td>
                        </tr>
                        <tr>
                            <td>Feedback/Support</td>
                            <td>If you provide us feedback or contact us for support we will collect your name and
                                e-mail address and possibly other personal information, as well as any other content
                                that you send to us in order to reply.
                            </td>
                        </tr>
                        <tr>
                            <td>Mailing List</td>
                            <td>When you sign up for one of our mailing lists we may collect your email address or
                                postal address.
                            </td>
                        </tr>
                        <tr>
                            <td>Online Forms and Submissions</td>
                            <td>We collect information you submit to us on the Products or through online forms to
                                process your requests.
                            </td>
                        </tr>
                        <tr>
                            <td>Surveys</td>
                            <td>When you participate in a survey we may collect additional information that you provide
                                through the survey. If the survey is provided by a third party service provider, the
                                third party’s privacy policy applies to the collection, use, and disclosure of your
                                information. Unless expressly indicated on the face of the survey we do not use survey
                                information to market products or services to survey participants. If you are provided a
                                separate privacy policy on part of a survey or study, the terms of that policy shall
                                govern your information.
                            </td>
                        </tr>
                        <tr>
                            <td>Third Party Tracking</td>
                            <td>The Products may participate in behavior-based advertising. This means that a third
                                party may be allowed to use technology (e.g., a cookie) to collect information about
                                your use of the Products so that they can provide advertising about products and
                                services tailored to your interests. If occurring, that advertising may appear either on
                                the Products, or on other websites. You can opt-out of receiving advertising based upon
                                your browsing behavior from some network advertising companies by going to the Network
                                Advertising Initiative and the Digital Advertising Alliance websites, although to
                                completely prevent advertising based upon your browsing behavior you should also disable
                                the cookies on your browser.
                            </td>
                        </tr>
                        <tr>
                            <td>Web Logs</td>
                            <td>We may collect information from you, including your browser type, operating system,
                                Internet Protocol (IP) address (a number that is automatically assigned to your computer
                                when you use the Internet), domain name, click-activity, referring website, and/or a
                                date/time stamp for your visit. Web logs may be used for things like monitoring website
                                usage levels and diagnosing problems.
                            </td>
                        </tr>
                        <tr>
                            <td>Device Information</td>
                            <td>We may collect information about the device accessing the Products such as MAC address,
                                device type, and device identifiers.
                            </td>
                        </tr>
                        <tr>
                            <td>Cookies</td>
                            <td>We may use cookies and clear GIFs. “Cookies” are small pieces of information that a
                                website or mobile website sends to your device while you are viewing a website. We may
                                use both session cookies (which expire once you close your web browser) and persistent
                                cookies (which stay on your device until you delete them). Among other things, cookies
                                allow us to provide you with a more personal and interactive experience and to improve
                                our marketing efforts. Persistent cookies may be removed by following instructions
                                provided by your browser. If you choose to disable cookies some areas or features of our
                                websites may not work properly.
                            </td>
                        </tr>
                    </table>
                </div>

                <p>In addition to the information that we collect from you directly, we may also receive information
                    about you from other sources, including third parties, business partners, our affiliates, or
                    publicly available sources.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>3. SHARING OF PERSONAL INFORMATION.</p>

                <p>In addition to the specific situations discussed elsewhere in this policy, we disclose personal
                    information in the following situations:</p>

                <div>
                    <ul>
                        <li><strong>Affiliates and Acquisitions.</strong> We may share your personal information with
                            our corporate affiliates (e.g., parent company, sister companies, subsidiaries, joint
                            ventures, or other companies under common control). If another company acquires our company,
                            business, or our assets, we will also share your personal information with that company.
                        </li>
                        <li><strong>Other Disclosures with Your Consent. </strong> We may ask if you would like us to
                            share your information with other unaffiliated third parties who are not described elsewhere
                            in this policy.
                        </li>
                        <li><strong>Other Disclosures without Your Consent.</strong> We may disclose personal
                            information in response to subpoenas, warrants, or court orders, in connection with any
                            legal or regulatory process, or to comply with relevant laws. We may also share your
                            personal information in order to establish or exercise our rights, to defend against a legal
                            claim, to investigate, prevent, or take action associated with possible illegal activities,
                            suspected fraud, safety of person or property, for audit purposes, or a violation of our
                            policies.
                        </li>
                        <li><strong>Service Providers.</strong> We may share your personal information with service
                            providers. Among other things service providers may help us to administer the Products,
                            conduct surveys, mail communications, and provide technical support. These service providers
                            may collect, store, analyze, or otherwise process information on our behalf.
                        </li>
                        <li><strong>Advertising and Marketing.</strong> We may use any statements that you communicate
                            to us through the Products regarding Trinity, Elastos Essentials or the website or any of
                            our products and services for advertising or marketing purposes.
                        </li>
                    </ul>
                </div>
            </section>

            <section>
                <p className={classes.sectionTitle}>4. YOUR CHOICES.</p>

                <p>You can make the following choices regarding your personal information:</p>
                <div>
                    <ol>
                        <li><strong>Changes to Your Personal Information.</strong> We rely on you to update and correct
                            your personal information. The Products allow you to modify or delete your account profile.
                            If you cannot remove or need help deleting your personal information, please contact us
                            using the instructions described in Section 10. Contact Information.
                        </li>
                        <li><strong>Deletion of Your Personal Information. </strong> Typically, we retain your personal
                            information for the period necessary to fulfill the purposes outlined in this policy, unless
                            a longer retention period is required or permitted by law. You may, however, request that we
                            delete your personal information. All requests must be directed in writing to the Contact
                            Information below. We may also decide to delete your data if we believe that the data is
                            incomplete, inaccurate, or that our continued use and storage are contrary to our
                            obligations to other individuals or third parties. When we delete personal information, it
                            will be removed from our active database, but it may remain in archives where it is not
                            practical or possible to delete it. In addition, we may keep your personal information as
                            needed to comply with our legal obligations, resolve disputes, and/or enforce any of our
                            agreements.
                        </li>
                        <li><strong>Revocation of Consent.</strong>If you revoke your consent for the processing of
                            personal information then we may no longer be able to provide you certain services. In some
                            cases, we may limit or deny your request to revoke consent if the law permits or requires us
                            to do so, if we are unable to adequately verify your identity, or if our processing is not
                            based on your consent.
                        </li>
                        <li><strong>Access to Your Personal information.</strong> If required by law, upon request, we
                            will grant reasonable access to personal information that we hold about you. Please direct
                            all requests using the instructions described in Section 10. Contact Information.
                        </li>
                        <li><strong>Online Tracking.</strong> We do not currently recognize automated browser signals
                            regarding tracking mechanisms, which may include "Do Not Track" instructions.
                        </li>
                        <li><strong>California Residents.</strong>California residents under California Civil Code
                            Section 1798.83 may be entitled to ask us for a notice describing what categories of
                            personal information (if any) we share with third parties or affiliates for those parties to
                            use for direct marketing. To submit your request, please email the address in the Contact
                            Information section below with the subject line "California Privacy" and your request in the
                            body of your email.
                        </li>
                        <li><strong>Decline to Provide. </strong> You may choose not to provide some types of personal
                            information to us. This choice may result in the Products or their functionality not
                            working.
                        </li>
                        <li><strong>Complaints. </strong> Complaints can be sent to us by way of email or letter using
                            the instructions listed in Section 10. Contact Information. Some jurisdictions may also
                            allow you to complain to a data protection authority as well.
                        </li>
                        <li><strong>Rights under GDPR.</strong> In addition to the above, you may also exercise your
                            rights under GDPR as stated in Section 5. European & GDPR Privacy Rights.
                        </li>
                    </ol>
                </div>
            </section>

            <section>
                <p className={classes.sectionTitle}>5. EUROPEAN & GDPR PRIVACY RIGHTS</p>

                <p>Under GDPR, in certain circumstances, you have the right to: (a) request access to any personal
                    information we hold about you and related information, (b) obtain without undue delay the
                    rectification of any inaccurate personal information, (c) request that your personal information is
                    deleted or erased provided the personal information is not required by us for compliance with a
                    legal obligation under European or Member State law or for the establishment, exercise or defense of
                    a legal claim, (d) prevent or restrict processing of your personal information, except to the extent
                    processing is required for the establishment, exercise or defense of legal claims; (e) object to the
                    processing of your personal data, and (e) request transfer of your personal information directly to
                    a third-party where this is technically feasible.</p>

                <p>You also have the right to complain to the ICO (www.ico.org.uk) if you feel there is a problem with
                    the way we are handling your data.</p>
                <p>We handle subject access requests in accordance with GDPR. Further you may learn more about your
                    rights by visiting www.ico.org.uk.</p>
                <p>You can exercise any of these rights by contacting us using the instructions described in Section 10.
                    Contact Information.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>6. WHAT ARE THE LEGAL GROUNDS FOR OUT PROCESSING OF YOUR PERSONAL INFORMATIO (INCLUDING WHEN WE
                    SHARE IT WITH OTHERS)?</p>

                <p>We rely on the following legal bases to use your personal data: (1) Consent, (2) Legal Obligation, or
                    (3) Legitimate Interests.</p>

                <p>
                    <strong>Lawful basis:</strong> Consent<br />
                    <strong>The reason we use this basis:</strong> With your consent, we process information to provide
                    you with the best possible experience for the Products. We may process information in accordance
                    with Section 1. Purpose, Use and Processing of Your Personal Information. Types of Information we
                    collect may vary as explained in Section 2. Types of Information We Collect. You can withdraw your
                    consent at any time by contacting us in writing using the Contact Information below. <br />
                    <strong>Data retention period:</strong> We will continue to process your information under this
                    basis until you withdraw consent or it is determined your consent no longer exists. <br />
                    <strong>Sharing your information: </strong> We do not share your information with third parties.
                </p>

                <p>
                    <strong>Lawful basis:</strong> Legal obligation <br />
                    <strong>The reason we use this basis:</strong> Trinity may rely on this lawful basis if we need to
                    process your personal data to comply with a common law or statutory obligation. <br />
                    <strong>Data retention period:</strong> In accordance with local legislation and statutory
                    obligation. <br />
                    <strong>Sharing your information: </strong> We do not share your information with third parties.
                </p>

                <p>
                    <strong>Lawful basis:</strong> Legitimate interests <br />
                    <strong>The reason we use this basis:</strong> We may process your information to provide you with
                    the best possible experience for the Products. This includes but is not limited to, (a) fraud
                    detection and prevention (crime prevention), (b) compliance with foreign law, law enforcement, court
                    and regulatory bodies’ requirements, (c) industry watch-lists and industry self-regulatory schemes,
                    (d) information, system, network and cyber security, (e) general corporate operations and due
                    diligence, (f) website or application development and enhancement, and (g) communications, marketing
                    and intelligence. <br />
                    <strong>Data retention period:</strong> We will continue to process your information under this
                    basis until you withdraw consent or until it is determined that a legitimate interest no longer
                    exists. <br />
                    <strong>Sharing your information: </strong> We do not share your information with third parties.
                </p>
            </section>

            <section>
                <p className={classes.sectionTitle}>7. HOW WE PROTECT PERSONAL INFORMATION.</p>

                <p>No method of transmission over the Internet, blockchain or method of electronic storage, is fully
                    secure. While we use reasonable efforts to protect your personal information from unauthorized
                    access, use, or disclosure, we cannot guarantee the security of your personal information. In the
                    event that we are required by law to inform you of any unauthorized access to your personal
                    information we may notify you electronically, in writing, or by telephone, if permitted to do so by
                    law.</p>

                <p>The Products may permit you to create an account. When you do you will be prompted to create a
                    password or mnemonic phrase. You are responsible for maintaining the confidentiality of your
                    password, and you are responsible for any access to or use of your account by someone else that has
                    obtained your password, whether or not such access or use has been authorized by you. You should
                    notify us of any unauthorized use of your password or account.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>8. COOKIES AND OTHER WEB DEVICES.</p>

                <p>The Products utilizing a website can send its own cookie to your web browser if your browser's
                    preferences allow it. Cookie settings can be controlled in your internet browser to automatically
                    reject some forms of cookies. If you view the Products without changing your cookie settings, you
                    are indicating you consent to receive all cookies from the Products. If you do not allow cookies,
                    some features and functionality of our site may not operate as expected.</p>

                <p>Trinity may use Adobe Flash technology (including Flash Local Stored Objects "Flash LSOs") that allow
                    the Products to, among other things, serve you with more tailored information, facilitate your
                    ongoing access to and use of the site, and collect and store information about your use of the site.
                    Some of our application, platforms, websites or emails also use pixel tags, web beacons, clear GIFs,
                    or other similar technologies to measure the success of marketing campaigns, and compile statistics
                    about usage and response rates, and other purposes.</p>

                <p>Trinity may use other web devices to track website and application usage and views. Please address
                    any questions or concerns about our cookie or web device usage using the instructions described in
                    Section 10. Contact Information.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>9. MISCELLANEOUS. </p>

                <p>The following additional information relates to our privacy practices:</p>

                <div>
                    <ol>
                        <li><strong>Minors.</strong> The Products are not for individuals under age 13 or deemed a minor
                            in the jurisdiction in which you reside. Those individuals should not access the Products or
                            provide personal information to us.
                        </li>
                        <li><strong>Transmission of Data to Other Countries. </strong> Your personal information may be
                            processed in other countries (such as the United States), where privacy laws may be less
                            stringent than the laws in your country and where the government, courts, or law enforcement
                            of that country may be able to access it. By submitting your personal information to us you
                            agree to the transfer, storage and processing of your information in those countries in
                            accordance with applicable laws (ie. GDPR) and certain safeguards for such transfers shall
                            be put in place.
                        </li>
                        <li><strong>Third Party Applications/Websites. </strong> We have no control over the privacy
                            practices of websites, dApps or applications that we do not own. You acknowledge and agree
                            to be responsible for reviewing the privacy practices and policies for any dApp you download
                            or use.
                        </li>
                        <li><strong>Changes To This Privacy Policy.</strong> We may change our privacy policy and
                            practices over time. To the extent that our policy changes in a material way, the policy
                            that was in place at the time that you submitted personal information to us will generally
                            govern that information.
                        </li>
                    </ol>
                </div>
            </section>

            <section>
                <p className={classes.sectionTitle}>10. CONTACT INFORMATION.</p>

                <p>If you have any questions, comments, or complaints concerning our privacy practices please contact us
                    at the appropriate email address below. We will respond to your requests in accordance with this
                    Privacy Policy and in a reasonable time and manner. Please note that Trinity may elect not to
                    respond to unreasonable or irrelevant requests.</p>

                <div className="address">
                    <p>Trinity Tech Co., Ltd. </p>
                    <p><strong>Address:</strong>Trust Company Complex, Ajeltake Road Ajeltake Island, Majuro MARSHALL
                        ISLANDS, MH96960</p>
                    <p><strong>Phone</strong>: 086-13817106015</p>
                    <p><strong>Email</strong>: contact@trinity-tech.io</p>
                </div>

                <p>Thank you from all of us for being part of the Trinity and Elastos community.</p>
            </section>
        </div>
    )
}