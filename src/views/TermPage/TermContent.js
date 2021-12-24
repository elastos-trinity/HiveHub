import React from "react"
import {makeStyles} from "@material-ui/core/styles"

export default function TermContent(props) {

    const useStyles = makeStyles({
        content: {
            paddingBottom: "30px",
            '& section': {
                margin: "20px 0"
            },

            '& p': {
                fontSize: "16px",
            }
        },

        sectionTitle: {
            fontWeight: "800",
            fontSize: "18px"
        },

        subTitle: {
            fontWeight: "600",
            fontSize: "14px"
        }
    });
    const classes = useStyles()

    return (
        <div className={classes.content}>
            <section>
                <p className={classes.sectionTitle}>AGREEMENT TO TERMS</p>

                <p>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Trinity Tech Co., Ltd. and its affiliates (“we,” “us” or “our”), concerning your access to and use of the Elastos Essentials Application, an application owned by Trinity Tech Co., Ltd., as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “App”). You agree that by accessing the App, you have read, understood, and agree to be bound by all of these Terms and Conditions Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS and CONDITIONS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE APP AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                <p>Supplemental terms and conditions or documents that may be posted on the App from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Terms and Conditions to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the App after the date such revised Terms are posted.</p>
                <p>The information provided on the App is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the App from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable. </p>
                <p>The App is intended for users who are at least 13 years of age. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the App. If you are a minor, you must have your parent or guardian read and agree to these Terms of Use prior to you using the App.</p>
            </section>


            <section>
                <p className={classes.sectionTitle}>INTELLECTUAL PROPERTY RIGHTS</p>

                <p>Unless otherwise indicated, the App is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the App (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions. The Content and the Marks are provided on the App “AS IS” for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the App and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>

                <p>Provided that you are eligible to use the App, you are granted a limited license to access and use the App and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the App, Content and the Marks.</p>

                {/*<div>*/}
                {/*    <ul>*/}
                {/*        <li>To identify you when you visit and use the Products.</li>*/}
                {/*        <li>To provide the products, information, and/or services you request.</li>*/}
                {/*        <li>To improve and personalize your experience with us.</li>*/}
                {/*        <li>To conduct analytics and solve problems.</li>*/}
                {/*        <li>To respond to your inquiries related to development support, tasks, projects, employment, or*/}
                {/*            other requests.*/}
                {/*        </li>*/}
                {/*        <li>To send marketing and promotional materials, including information relating to our platform,*/}
                {/*            products, services, newsletters, or tips.*/}
                {/*        </li>*/}
                {/*        <li>In some instances, to provide you with advertisements.</li>*/}
                {/*        <li>For internal administrative purposes, as well as to manage our relationship with you.</li>*/}
                {/*    </ul>*/}
                {/*</div>*/}
            </section>

            <section>
                <p className={classes.sectionTitle}>USER REPRESENTATIONS</p>
                <p>By using the App, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use; (4) you are not under the age of 13; (5) not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the App; (6) you will not access the App through automated or non-human means, whether through a bot, script or otherwise; (7) you will not use the App for any illegal or unauthorized purpose; and (8) your use of the App will not violate any applicable law or regulation.</p>
                <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the App (or any portion thereof).</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>USER REGISTRATION</p>
                <p>You may be required to register with the App. You agree to keep your DID and/or username, private keys, and password confidential and will be responsible for all use of your account and password. In case DIDs are not used, we reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
            </section>



            <section>
                <p className={classes.sectionTitle}>PROHIBITED ACTIVITIES</p>
                <p>You may not access or use the App for any purpose other than that for which we make the App available. The App may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us (ie. approved dApp).</p>
                <p>As a user of the App, you agree not to:</p>
                <div>
                    <ol>
                        <li>systematically retrieve data or other content from the App to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                        <li>make any unauthorized use of the App, including collecting DIDs, usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                        <li>use a buying agent or purchasing agent to make purchases on the App.</li>
                        <li>use the App to advertise or offer to sell goods and services.</li>
                        <li>circumvent, disable, or otherwise interfere with security-related features of the App, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the App and/or the Content contained therein.</li>
                        <li>engage in unauthorized framing of or linking to the App.</li>
                        <li>trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords;</li>
                        <li>make improper use of our support services or submit false reports of abuse or misconduct.</li>
                        <li>engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                        <li>interfere with, disrupt, or create an undue burden on the App or the networks or services connected to the App.</li>
                        <li>attempt to impersonate another user or person or use the username of another user.</li>
                        <li>sell or otherwise transfer your profile.</li>
                        <li>use any information obtained from the App in order to harass, abuse, or harm another person.</li>
                        <li>use the App as part of any effort to compete with us or otherwise use the App and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                        <li>decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the App.</li>
                        <li>attempt to bypass any measures of the App designed to prevent or restrict access to the App, or any portion of the App.</li>
                        <li>harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the App to you.</li>
                        <li>delete the copyright or other proprietary rights notice from any Content.</li>
                        <li>copy or adapt the App’s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
                        <li>upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the App or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the App.</li>
                        <li>upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware” or “passive collection mechanisms” or “pcms”).</li>
                        <li>except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the App, or using or launching any unauthorized script or other software.</li>
                        <li>disparage, tarnish, or otherwise harm, in our opinion, us and/or the App.</li>
                        <li>use the App in a manner inconsistent with any applicable laws or regulations.</li>
                    </ol>
                </div>
            </section>
            
            
            <section>
                <p className={classes.sectionTitle}>USER GENERATED CONTRIBUTIONS</p>

                <p>The App may invite you to chat, contribute to, or participate in blogs, quizzes, code development, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the App, including but not limited to text, code, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the App and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:</p>
                <div>
                    <ol>
                        <li>the creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.</li>
                        <li> you are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the App, and other users of the App to use your Contributions in any manner contemplated by the App and these Terms of Use.</li>
                        <li>you have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the App and these Terms of Use.</li>
                        <li> your Contributions are not false, inaccurate, or misleading.</li>
                        <li>your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.</li>
                        <li>your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</li>
                        <li>your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</li>
                        <li>your Contributions do not advocate the violent overthrow of any government or incite, encourage, or threaten physical harm against another.</li>
                        <li>your Contributions do not violate any applicable law, regulation, or rule.</li>
                        <li>your Contributions do not violate the privacy or publicity rights of any third party.</li>
                        <li>your Contributions do not contain any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner.</li>
                        <li>your Contributions do not violate any federal or state law concerning child pornography, or otherwise intended to protect the health or well-being of minors;</li>
                        <li>your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.</li>
                        <li>your Contributions do not otherwise violate, or link to material that violates, any provision of these Terms of Use, or any applicable law or regulation.</li>
                    </ol>
                </div>

                <p>Any use of the App in violation of the foregoing violates these Terms of Use and may result in, among other things, termination or suspension of your rights to use the App.</p>

            </section>
            <section>
                <p className={classes.sectionTitle}>CONTRIBUTION LICENSE</p>
                <p>By posting your Contributions to any part of the App or making Contributions accessible to the App by linking your account from the App to any of your social networking accounts, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.</p>
                <p>This license will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.</p>
                <p>We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the App. You are solely responsible for your Contributions to the App and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.</p>
                <p>We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2) to re-categorize any Contributions to place them in more appropriate locations on the App; and (3) to pre-screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.</p>

            </section>
            <section>
                <p className={classes.sectionTitle}>MOBILE APPLICATION LICENSE</p>

                <span className={classes.subTitle}>Use License</span>
                <p>If you download the App, then we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the mobile application on wireless electronic devices owned or controlled by you, and to access and use the mobile application on such devices strictly in accordance with the terms and conditions of this mobile application license contained in these Terms of Use. You shall not: (1) decompile, reverse engineer, disassemble, attempt to derive the source code of, or decrypt the application which is not specifically labeled as “open source”; (2) make any modification, adaptation, improvement, enhancement, translation, or derivative work from the application; (3) violate any applicable laws, rules, or regulations in connection with your access or use of the application; (4) remove, alter, or obscure any proprietary notice (including any notice of copyright or trademark) posted by us or the licensors of the application; (5) use the application for any revenue generating endeavor, commercial enterprise, or other purpose for which it is not designed or intended; (6) make the application available over a network or other environment permitting access or use by multiple devices or users at the same time; (7) use the application for creating a product, service, or software that is, directly or indirectly, competitive with or in any way a substitute for the application; (8) use the application to send automated queries to any website or to send any unsolicited commercial e-mail; or (9) use any proprietary information or any of our interfaces or our other intellectual property in the design, development, manufacture, licensing, or distribution of any applications, accessories, or devices for use with the application.</p>

                <span className={classes.subTitle}>Apple and Android Devices</span>
                <p>The following terms apply when you use a mobile application obtained from either the Apple Store or Google Play (each an “App Distributor”) to access the App: (1) the license granted to you for our mobile application is limited to a non-transferable license to use the application on a device that utilizes the Apple iOS or Android operating systems, as applicable, and in accordance with the usage rules set forth in the applicable App Distributor’s terms of service; (2) we are responsible for providing any maintenance and support services with respect to the mobile application as specified in the terms and conditions of this mobile application license contained in these Terms of Use or as otherwise required under applicable law, and you acknowledge that each App Distributor has no obligation whatsoever to furnish any maintenance and support services with respect to the mobile application; (3) in the event of any failure of the mobile application to conform to any applicable warranty, you may notify the applicable App Distributor, and the App Distributor, in accordance with its terms and policies, may refund the purchase price, if any, paid for the mobile application, and to the maximum extent permitted by applicable law, the App Distributor will have no other warranty obligation whatsoever with respect to the mobile application; (4) you represent and warrant that (i) you are not located in a country that is subject to a U.S. government embargo, or that has been designated by the U.S. government as a “terrorist supporting” country and (ii) you are not listed on any U.S. government list of prohibited or restricted parties; (5) you must comply with applicable third-party terms of agreement when using the mobile application, e.g., if you have a VoIP application, then you must not be in violation of their wireless data service agreement when using the mobile application; and (6) you acknowledge and agree that the App Distributors are third-party beneficiaries of the terms and conditions in this mobile application license contained in these Terms of Use, and that each App Distributor will have the right (and will be deemed to have accepted the right) to enforce the terms and conditions in this mobile application license contained in these Terms of Use against you as a third-party beneficiary thereof.</p>
            </section>
            <section>
                <p className={classes.sectionTitle}>SUBMISSIONS</p>
                <p>You acknowledge and agree that any questions, comments, quiz answers, polls, suggestions, ideas, feedback, or other information regarding the App ("Submissions") provided by you to us are non-confidential and shall become our sole property. We shall own exclusive rights, including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of these Submissions for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you. You hereby waive all moral rights to any such Submissions, and you hereby warrant that any such Submissions are original with you or that you have the right to submit such Submissions. You agree there shall be no recourse against us for any alleged or actual infringement or misappropriation of any proprietary right in your Submissions.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>THIRD-PARTY WEBSITES AND CONTENT</p>
                <p>The App may contain (or you may be sent via the App) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the App or any Third-Party Content posted on, available through, or installed from the App, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the App and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Terms of Use no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the App or relating to any applications you use or install from the App. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party. You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us harmless from any harm caused by your purchase of such products or services. Additionally, you shall hold us harmless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>ADVERTISERS</p>
                <p>We may allow advertisers to display their advertisements and other information in certain areas of the App, such as sidebar advertisements or banner advertisements. If you are an advertiser, you shall take full responsibility for any advertisements you place on the App and any services provided on the App or products sold through those advertisements. Further, as an advertiser, you warrant and represent that you possess all rights and authority to place advertisements on the App, including, but not limited to, intellectual property rights, publicity rights, and contractual rights. As an advertiser, you agree that such advertisements are subject to our Digital Millennium Copyright Act (“DMCA”) Notice and Policy provisions as described below, and you understand and agree there will be no refund or other compensation for DMCA takedown-related issues. We simply provide the space to place such advertisements, and we have no other relationship with advertisers.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>SITE MANAGEMENT</p>
                <p>We reserve the right, but not the obligation, to: (1) monitor the App for violations of these Terms of Use; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Use, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the App or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the App in a manner designed to protect our rights and property and to facilitate the proper functioning of the App.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>PRIVACY POLICY</p>
                <p>We care about data privacy and security. Please review our Privacy Policy located at https://www.trinity-tech.io. By using the App, you agree to be bound by our Privacy Policy, which is incorporated into these Terms of Use. Please be advised the App may be hosted globally and on nodes based on the blockchain framework. We do not knowingly accept, request, or solicit information from children or knowingly market to children. Therefore, if we receive actual knowledge that anyone under the age of 13 has provided personal information to us without the requisite and verifiable parental consent, we will delete that information from the App as quickly as is reasonably practical.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY</p>

                <span className={classes.subTitle}>Notifications</span>
                <p>We respect the intellectual property rights of others. If you believe that any material available on
                    or through the App infringes upon any copyright you own or control, please immediately notify our
                    Designated Copyright Agent using the contact information provided below (a “Notification”). A copy
                    of your Notification will be sent to the person who posted or stored the material addressed in the
                    Notification. Please be advised that pursuant to federal law you may be held liable for damages if
                    you make material misrepresentations in a Notification. Thus, if you are not sure that material
                    located on or linked to by the App infringes your copyright, you should consider first contacting an
                    attorney.</p>
                <p>All Notifications should meet the requirements of DMCA 17 U.S.C. § 512(c)(3) and include the
                    following information: (1) A physical or electronic signature of a person authorized to act on
                    behalf of the owner of an exclusive right that is allegedly infringed; (2) identification of the
                    copyrighted work claimed to have been infringed, or, if multiple copyrighted works on the App are
                    covered by the Notification, a representative list of such works on the App; (3) identification of
                    the material that is claimed to be infringing or to be the subject of infringing activity and that
                    is to be removed or access to which is to be disabled, and information reasonably sufficient to
                    permit us to locate the material; (4) information reasonably sufficient to permit us to contact the
                    complaining party, such as an address, telephone number, and, if available, an email address at
                    which the complaining party may be contacted; (5) a statement that the complaining party has a good
                    faith belief that use of the material in the manner complained of is not authorized by the copyright
                    owner, its agent, or the law; and (6) a statement that the information in the notification is
                    accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of
                    the owner of an exclusive right that is allegedly infringed upon.</p>

                <span className={classes.subTitle}>Counter Notification</span>
                <p>If you believe your own copyrighted material has been removed from the App as a result of a mistake
                    or misidentification, you may submit a written counter notification to us using the contact
                    information provided below (a “Counter Notification”). To be an effective Counter Notification under
                    the DMCA, your Counter Notification must include substantially the following: (1) identification of
                    the material that has been removed or disabled and the location at which the material appeared
                    before it was removed or disabled; (2) a statement that you consent to the jurisdiction of the
                    Federal District Court in which your address is located, or if your address is outside the United
                    States, for any judicial district in which we are located; (3) a statement that you will accept
                    service of process from the party that filed the Notification or the party's agent; (4) your name,
                    address, and telephone number; (5) a statement under penalty of perjury that you have a good faith
                    belief that the material in question was removed or disabled as a result of a mistake or
                    misidentification of the material to be removed or disabled; and (6) your physical or electronic
                    signature.</p>
                <p>If you send us a valid, written Counter Notification meeting the requirements described above, we
                    will restore your removed or disabled material, unless we first receive notice from the party filing
                    the Notification informing us that such party has filed a court action to restrain you from engaging
                    in infringing activity related to the material in question. Please note that if you materially
                    misrepresent that the disabled or removed content was removed by mistake or misidentification, you
                    may be liable for damages, including costs and attorney's fees. Filing a false Counter Notification
                    constitutes perjury.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>TERM AND TERMINATION</p>

                <p>These Terms of Use shall remain in full force and effect while you use the App. WITHOUT LIMITING ANY
                    OTHER PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT
                    NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE APP (INCLUDING BLOCKING CERTAIN IP ADDRESSES OR
                    ELASTOS DIDS), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR
                    BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF USE OR OF ANY
                    APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE APP OR DELETE YOUR
                    ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE
                    DISCRETION.</p>
                <p>If we terminate or suspend your account for any reason, you are prohibited from registering and
                    creating a new account under your name, a fake or borrowed name, or the name of any third party,
                    even if you may be acting on behalf of the third party. In addition to terminating or suspending
                    your account, we reserve the right to take appropriate legal action, including without limitation
                    pursuing civil, criminal, and injunctive redress.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>MODIFICATIONS AND INTERRUPTIONS</p>

                <p>We reserve the right to change, modify, or remove the contents of the App at any time or for any
                    reason at our sole discretion without notice. However, we have no obligation to update any
                    information on our Site. We also reserve the right to modify or discontinue all or part of the App
                    without notice at any time. We will not be liable to you or any third party for any modification,
                    price change, suspension, or discontinuance of the App.</p>
                <p>We cannot guarantee the App will be available at all times. We may experience hardware, software, or
                    other problems or need to perform maintenance related to the App, resulting in interruptions,
                    delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or
                    otherwise modify the App at any time or for any reason without notice to you. You agree that we have
                    no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or
                    use the App during any downtime or discontinuance of the App. Nothing in these Terms of Use will be
                    construed to obligate us to maintain and support the App or to supply any corrections, updates, or
                    releases in connection therewith.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>GOVERNING LAW</p>
                <p>These Terms of Use and your use of the App shall be construed in accordance with the laws of the
                    State of Delaware, USA.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>DISPUTE RESOLUTION</p>

                <span className={classes.subTitle}>Informal Negotiations</span>
                <p>To expedite resolution and control the cost of any dispute, controversy, or claim related to these
                    Terms of Use (each a "Dispute" and collectively, the “Disputes”) brought by either you or us
                    (individually, a “Party” and collectively, the “Parties”), the Parties agree to first attempt to
                    negotiate any Dispute (except those Disputes expressly provided below) informally for at least 45
                    days before initiating arbitration. Such informal negotiations commence upon written notice from one
                    Party to the other Party.</p>

                <span className={classes.subTitle}>Binding Arbitration</span>
                <p>To expedite resolution and control the cost of any dispute, controversy or claim related to these
                    Terms of Use (each a "Dispute" and collectively, “Disputes”), any Dispute brought by either you or
                    us (individually, a “Party” and collectively, the “Parties”) shall be finally and exclusively
                    resolved by binding arbitration. YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE
                    RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL. The arbitration shall be commenced and conducted under
                    the Commercial Arbitration Rules of the American Arbitration Association ("AAA") and, where
                    appropriate, the AAA’s Supplementary Procedures for Consumer Related Disputes ("AAA Consumer
                    Rules"), both of which are available at the AAA website www.adr.org. Your arbitration fees and your
                    share of arbitrator compensation shall be governed by the AAA Consumer Rules and, where appropriate,
                    limited by the AAA Consumer Rules. The arbitration may be conducted in person, through the
                    submission of documents, by phone, or online. The arbitrator will make a decision in writing, but
                    need not provide a statement of reasons unless requested by either Party. The arbitrator must follow
                    applicable law, and any award may be challenged if the arbitrator fails to do so. Except as
                    otherwise provided herein, the Parties may litigate in court to compel arbitration, stay proceedings
                    pending arbitration, or to confirm, modify, vacate, or enter judgment on the award entered by the
                    arbitrator.</p>

                <span className={classes.subTitle}>Restrictions</span>
                <p>The Parties agree that any arbitration shall be limited to the Dispute between the Parties
                    individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other
                    proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action
                    basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute
                    to be brought in a purported representative capacity on behalf of the general public or any other
                    persons.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>CORRECTIONS</p>
                <p>There may be information on the App that contains typographical errors, inaccuracies, or omissions
                    that may relate to the App, including descriptions, pricing, availability, and various other
                    information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or
                    update the information on the App at any time, without prior notice.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>DISCLAIMER</p>
                <p>THE APP IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE APP SERVICES
                    WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                    EXPRESS OR IMPLIED, IN CONNECTION WITH THE APP AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION,
                    THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE APP’S CONTENT OR
                    THE CONTENT OF ANY WEBSITES LINKED TO THIS SITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY
                    FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR
                    PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE APP, (3) ANY
                    UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR
                    FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM
                    THE APP, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH
                    THE APP BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR
                    ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED,
                    OR OTHERWISE MADE AVAILABLE VIA THE APP. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME
                    RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE APP,
                    ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER
                    ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY
                    TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE
                    OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT
                    AND EXERCISE CAUTION WHERE APPROPRIATE.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>LIMITATIONS OF LIABILITY</p>
                <p>IN NO EVENT WILL WE, ELASTOS FOUNDATION LTD., OR OUR DIRECTORS, MANGERS, MEMBERS, EMPLOYEES, OR
                    AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY,
                    INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR
                    OTHER DAMAGES ARISING FROM YOUR USE OF THE APP, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
                    SUCH DAMAGES.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>INDEMNIFICATION</p>
                <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all
                    of our respective officers, agents, partners, and employees, from and against any loss, damage,
                    liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third
                    party due to or arising out of: (1) your Contributions; (2) use of the App; (3) breach of these
                    Terms of Use; (4) any breach of your representations and warranties set forth in these Terms of Use;
                    (5) your violation of the rights of a third party, including but not limited to intellectual
                    property rights; or (6) any overt harmful act toward any other user of the App with whom you
                    connected via the App. Notwithstanding the foregoing, we reserve the right, at your expense, to
                    assume the exclusive defense and control of any matter for which you are required to indemnify us,
                    and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable
                    efforts to notify you of any such claim, action, or proceeding which is subject to this
                    indemnification upon becoming aware of it. </p>
            </section>

            <section>
                <p className={classes.sectionTitle}>TAX TREATMENT AND ACCOUNTING</p>

                <p>We will never provide advice on payments or taxation as it relates to receiving any form of payment
                    in tokens, coins or other form of currency (“Payment”) for developer services, dApps, or any other
                    service provided through the App, and further, if you receive a Payment you shall assume any and all
                    liabilities and risks related to receiving Payments and taxable income. You are expected to adhere
                    to, and shall follow, all applicable international, federal, state and/or local regulations,
                    guidelines and laws as it relates to reporting taxable income. Holding cryptocurrency is considered
                    a high-risk activity and we strongly encourage you to perform due diligence before considering
                    receiving any Payments.</p>
                <p>Any Payments sent by us to you may be subject to the tax laws and regulations in any applicable
                    jurisdictions. The tax treatment and accounting of transactions in relation to crypto payments are
                    uncertain and a largely untested area of law and practice that is subject to prospective and
                    retroactive changes without notice. Tax treatment of cryptographic tokens and cryptocurrencies may
                    vary amongst jurisdictions.</p>
                <p>Your participation in developing and receiving crypto payments in connection with any purchase,
                    grant, delivery, exercise, vesting, distribution, activation, holding, use, appreciation,
                    conversion, sale, exchange, redemption, assignment, transfer, disposal, may attract taxes either now
                    or in the future. We may receive formal or informal queries, notices, requests, or summons from tax
                    authorities, and as a result, we may be required to furnish certain information about your Payment
                    from us for services rendered. You must seek independent professional advice on the tax implications
                    in relation to receiving and sending Payments, use of the App and/or any other transactions for your
                    particular situation.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>LOSS OF PRIVATE KEYS</p>
                <p>You alone are responsible for securing your private keys and you expressly release us from any and
                    all liability as it relates to the loss of private keys. Losing control of your private key will
                    permanently and irreversibly deny you access to any coins or tokens sent to your public address or
                    DID. Neither us nor any other person will be able to retrieve or protect your coins or tokens if you
                    lose your private keys. Once lost, you will not be able to transfer your coins or tokens to any
                    other address or wallet. You will not be able to realize any value or utility that the coins or
                    tokens may hold now or in future.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>USER DATA</p>
                <p>We will maintain certain data that you transmit to the App for the purpose of managing the App, as
                    well as data relating to your use of the App. Although we perform regular routine backups of data,
                    you are solely responsible for all data that you transmit or that relates to any activity you have
                    undertaken using the App. You agree that we shall have no liability to you for any loss or
                    corruption of any such data, and you hereby waive any right of action against us arising from any
                    such loss or corruption of such data.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</p>
                <p>Visiting the App, sending us emails, and completing online forms constitute electronic
                    communications. You consent to receive electronic communications, and you agree that all agreements,
                    notices, disclosures, and other communications we provide to you electronically, via email and on
                    the App, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO
                    THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY
                    OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE APP. You
                    hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other
                    laws in any jurisdiction which require an original signature or delivery or retention of
                    non-electronic records, or to payments or the granting of credits by any means other than electronic
                    means.
                </p>
            </section>

            <section>
                <p className={classes.sectionTitle}>CALIFORNIA USERS AND RESIDENTS</p>
                <p>If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance
                    Unit of the Division of Consumer Services of the California Department of Consumer Affairs in
                    writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at
                    (800) 952-5210 or (916) 445-1254.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>MISCELLANEOUS</p>
                <p>These Terms of Use and any policies or operating rules posted by us on the App constitute the entire
                    agreement and understanding between you and us. Our failure to exercise or enforce any right or
                    provision of these Terms of Use shall not operate as a waiver of such right or provision. These
                    Terms of Use operate to the fullest extent permissible by law. We may assign any or all of our
                    rights and obligations to others at any time. We shall not be responsible or liable for any loss,
                    damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision
                    or part of a provision of these Terms of Use is determined to be unlawful, void, or unenforceable,
                    that provision or part of the provision is deemed severable from these Terms of Use and does not
                    affect the validity and enforceability of any remaining provisions. There is no joint venture,
                    partnership, employment or agency relationship created between you and us as a result of these Terms
                    of Use or use of the App. You agree that these Terms of Use will not be construed against us by
                    virtue of having drafted them. You hereby waive any and all defenses you may have based on the
                    electronic form of these Terms of Use and the lack of signing by the parties hereto to execute these
                    Terms of Use.</p>
            </section>

            <section>
                <p className={classes.sectionTitle}>CONTACT US</p>
                <p>In order to resolve a complaint regarding the App or to receive further information regarding use of
                    the App, please contact us at:</p>
                <div className="address">
                    <p>Business Name: Trinity Tech Co., Ltd.</p>
                    <p>Trust Company Complex, Ajeltake Road</p>
                    <p>Ajeltake Island, Majuro</p>
                    <p>MARSHALL ISLANDS, MH96960</p>
                    <p>Phone: 086-13817106015</p>
                    <p>Email: contact@trinity-tech.io</p>
                </div>
            </section>
        </div>
    )
}