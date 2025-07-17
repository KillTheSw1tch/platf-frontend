import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/MainPage';
import LoginPage from './pages/Login';
import RegistrationPage from './pages/registrationPage';
import AddCargoPage from './pages/add_cargo';
import UserProfile from './pages/UserProfile';
import VerifyCode from './pages/VerifyCode';
import Services from './pages/Services';
import Support from './pages/Support';
import Contacts from './pages/Contacts';
import TruckPostingForm from './pages/add_vehicle';
import Layout from './components/Layout';

import SearchCargoResult from './pages/SearchCargoResult';

import MyOrdersCombined from './pages/MyOrdersCombined'; 
import MyCompany from './pages/MyCompany.jsx'; 
import CompanyOverview from './pages/CompanyOverview';
import PendingReview from "./pages/PendingReview";
import CompanyDetails from './pages/CompanyDetails';

import MyTeamPage from './pages/MyTeamPage';

import Enable2FA from "./pages/Enable2FA";

import Verify2FA from './pages/Verify2FA';

import ChangePassword from "./pages/ChangePassword";

import PendingReviewPage from './pages/PendingReviewPage';






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="add-cargo" element={<AddCargoPage />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="verify-code" element={<VerifyCode />} />
          <Route path="services" element={<Services />} />
          <Route path="support" element={<Support />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="add-vehicle" element={<TruckPostingForm />} />
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="search-cargo" element={<SearchCargoResult />} />
          
          <Route path="/my-orders" element={<MyOrdersCombined />} />
          <Route path="/my-company" element={<MyCompany />} />
          <Route path="/my-company/overview" element={<CompanyOverview />} />
          {/* <Route path="/my-company/pending-review" element={<PendingReview />} /> */}
          <Route path="/company-profile/:companyName" element={<CompanyDetails />} />

          <Route path="/my-team" element={<MyTeamPage />} />

          <Route path="/enable-2fa" element={<Enable2FA />} />

          <Route path="/verify-2fa" element={<Verify2FA />} />

          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/my-company/pending-review" element={<PendingReviewPage />} />




        </Route>
      </Routes>
    </Router>
  );
}

export default App;
