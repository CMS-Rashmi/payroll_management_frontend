// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // match file name
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard"; 
import EmployeeInfo from "./pages/EmployeeInfo"; 
import AddEmployee from "./pages/AddEmployee"; 
import AttendanceLeave from "./pages/AttendanceLeave"; 
import PerformanceTraining from "./pages/PerformanceTraining"; 
import DocumentsContracts from "./pages/DocumentsContracts";
import AuditLogs from "./pages/AuditLogs";
import Earnings from "./pages/Earnings";
import Deductions from "./pages/Deductions";
import Allowances from "./pages/Allowances";
import EditEmployee from "./pages/EditEmployee";        //new changes   - dev-shanika
import AddDeduction from "./pages/AddDeduction";        //new changes    - dev-rashmi
import AddLeave from "./pages/AddLeave";
import OvertimeAdjustments from "./pages/OvertimeAdjustments";
import CompensationAdjustment from "./pages/CompensationAdjustment";
import NetSalarySummary from "./pages/NetSalarySummary";
import BulkActions from "./pages/BulkActions";
import Policies from "./pages/Policies";
import Designations from "./pages/Designations";
import ViewEmployee from "./pages/ViewEmployee";
import AttendanceOverview from "./pages/AttendanceOverview";
import TimeManagement from "./pages/TimeManagement";
import AbsenceReport from "./pages/AbsenceReport";
import AttendanceAdjustment from "./pages/AttendanceAdjustment";
import EmployeeAdjustment from "./pages/EmployeeAdjustment";
import CheckinCheckoutReport from "./pages/CheckinCheckoutReport";

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Login />} />
       <Route path="/header" element={<Header />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/employee-info" element={<EmployeeInfo />} />
       <Route path="/add-employee" element={<AddEmployee />} />
       <Route path="/attendance-leave" element={<AttendanceLeave />} />
       <Route path="/performance-training" element={<PerformanceTraining />} />
       <Route path="/documents-contracts" element={<DocumentsContracts />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/deductions" element={<Deductions />} />
      <Route path="/allowances" element={<Allowances />} />
      <Route path="/employees" element={<AddEmployee/>} />     
      <Route path="/employees/:id/edit" element={<EditEmployee/>} />        
      <Route path="/add-deduction" element={<AddDeduction/>} />  
      <Route path="/add-leave" element={<AddLeave/>} />     
      <Route path="/overtime-adjustments" element={<OvertimeAdjustments/>}/>
      <Route path="/compensation-adjustment" element={<CompensationAdjustment/>}/>
      <Route path="/net-salary-summary" element={<NetSalarySummary/>}/>
      <Route path="//employees/:id/view" element={<ViewEmployee/>}/>
      <Route path="/attendance-overview" element={<AttendanceOverview/>}/>
      <Route path="/time-management" element={<TimeManagement/>}/>
      <Route path="/absence-report" element={<AbsenceReport/>}/>
      <Route path="/attendance-adjustment" element={<AttendanceAdjustment/>}/>
      <Route path="/attendance-adjustment/:id" element={<EmployeeAdjustment />} />
      <Route path="/checkin-checkout-report" element={<CheckinCheckoutReport />} />


      {/* Admin helpers*/}
      <Route path="/bulk-actions" element={<BulkActions/>}/>
      <Route path="/policies" element={<Policies/>}/>
      <Route path="/designations" element={<Designations/>}/>

      </Routes>
    </Router>
  );
}

export default App;
