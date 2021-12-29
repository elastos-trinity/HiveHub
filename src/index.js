import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import './i18n';
import { LanguageContext } from "./context"

import "assets/scss/material-kit-react.scss?v=1.9.0";

// pages for this product
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import DidRepairPage from "views/DidRepairPage/DidRepairPage.js";
import PrivacyPolicyPage from "./views/PrivacyPolicy/PrivacyPolicy";
import TermPage from "./views/TermPage/TermPage";
import SearchResult from "./views/SearchResult";
import NodeDetails from "./views/NodeDetails/NodeDetails";
import Dashboard from "./views/Dashboard";
import NewNode from "./views/NewNode";

let browserHistory = createBrowserHistory();

function App() {
    let { i18n } = useTranslation();

    return (
        <LanguageContext.Provider value={
            {
                language:'en',
                changeLanguage: () => {
                    i18n.changeLanguage(i18n.language === 'en'? 'zh': 'en').catch(console.log)
                }
            }
        }>
            <Router history={browserHistory}>
                <Switch>
                    <Route path="/login-page" component={LoginPage} />
                    <Route path="/landing-page" component={LandingPage} />
                    <Route path="/did-repair" component={DidRepairPage} />
                    <Route path="/privacy-policy" component={PrivacyPolicyPage} />
                    <Route path="/terms" component={TermPage} />
                    <Route path="/search" component={SearchResult} />
                    <Route path="/node" component={NodeDetails} />
                    <Route path="/new-node" component={NewNode} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/" component={Components} />
                </Switch>
            </Router>
        </LanguageContext.Provider>
    )
}

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);
