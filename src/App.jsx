// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // match file name
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

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Login />} />
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
      </Routes>
    </Router>
  );
}

export default App;
