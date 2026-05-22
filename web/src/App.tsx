import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ReportList from './pages/ReportList';
import ReportEditor from './pages/ReportEditor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ReportList />} />
          <Route path="reports/:id" element={<ReportEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
