import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, Download, Plus, ChevronDown, ChevronRight, Clock, Check, AlertTriangle, Mail as MailIcon, CheckCircle } from 'lucide-react';
import './Payments.css';
import { mockClients } from './Clients';

// Mock data
const paymentData = [
  { id: 1, customer: mockClients[0]?.name || "", amount: 1250, status: "paid", date: "2025-05-10", method: "Credit Card" },
  { id: 2, customer: mockClients[1]?.name || "", amount: 3400, status: "pending", date: "2025-05-12", method: "Bank Transfer" },
  { id: 3, customer: mockClients[2]?.name || "", amount: 780, status: "paid", date: "2025-05-08", method: "PayPal" },
  { id: 4, customer: mockClients[3]?.name || "", amount: 2100, status: "overdue", date: "2025-05-01", method: "Credit Card" },
  { id: 5, customer: mockClients[4]?.name || "", amount: 1650, status: "paid", date: "2025-05-09", method: "Bank Transfer" },
];

// Customer data
const customerData = [
  { 
    id: 1, 
    name: mockClients[0]?.name || "", 
    logo: "A", // Placeholder for logo 
    contact: "John Smith", 
    email: "jsmith@acme.com", 
    phone: "+1 (555) 123-4567", 
    since: "2023-01-15", 
    totalSpent: 24500, 
    projects: 5, 
    status: "active", 
    industry: "Manufacturing",
    location: "Chicago, IL",
    lastPayment: "2025-05-10"
  },
  { 
    id: 2, 
    name: mockClients[1]?.name || "", 
    logo: "T", 
    contact: "Emily Johnson", 
    email: "emily@techgiant.com", 
    phone: "+1 (555) 234-5678", 
    since: "2024-03-20", 
    totalSpent: 18900, 
    projects: 2, 
    status: "active",
    industry: "Technology",
    location: "San Francisco, CA",
    lastPayment: "2025-04-15"
  },
  { 
    id: 3, 
    name: mockClients[2]?.name || "", 
    logo: "G", 
    contact: "Michael Chen", 
    email: "mchen@globalserv.com", 
    phone: "+1 (555) 345-6789", 
    since: "2022-09-05", 
    totalSpent: 42800, 
    projects: 8, 
    status: "active",
    industry: "Consulting",
    location: "New York, NY",
    lastPayment: "2025-05-08"
  },
  { 
    id: 4, 
    name: mockClients[3]?.name || "", 
    logo: "S", 
    contact: "Laura Martinez", 
    email: "laura@smartsol.com", 
    phone: "+1 (555) 456-7890", 
    since: "2025-04-10", 
    totalSpent: 2100, 
    projects: 1, 
    status: "new",
    industry: "Education",
    location: "Austin, TX",
    lastPayment: "2025-05-01"
  },
  { 
    id: 5, 
    name: mockClients[4]?.name || "", 
    logo: "I", 
    contact: "Robert Williams", 
    email: "rwilliams@innovate.com", 
    phone: "+1 (555) 567-8901", 
    since: "2023-11-12", 
    totalSpent: 15200, 
    projects: 4, 
    status: "active",
    industry: "Healthcare",
    location: "Boston, MA",
    lastPayment: "2025-05-09"
  },
  { 
    id: 6, 
    name: "DataTech Solutions", 
    logo: "D", 
    contact: "Sarah Johnson", 
    email: "sarah@datatech.com", 
    phone: "+1 (555) 678-9012", 
    since: "2023-06-28", 
    totalSpent: 31500, 
    projects: 6, 
    status: "active",
    industry: "Data Analytics",
    location: "Seattle, WA",
    lastPayment: "2025-05-05"
  },
  { 
    id: 7, 
    name: "Cloudera Inc", 
    logo: "C", 
    contact: "David Kim", 
    email: "david@cloudera.com", 
    phone: "+1 (555) 789-0123", 
    since: "2024-01-05", 
    totalSpent: 9800, 
    projects: 3, 
    status: "active",
    industry: "Cloud Services",
    location: "Denver, CO",
    lastPayment: "2025-05-02"
  },
];

const monthlyData = [
  { month: 'Jan', revenue: 14500 },
  { month: 'Feb', revenue: 18200 },
  { month: 'Mar', revenue: 16700 },
  { month: 'Apr', revenue: 19300 },
  { month: 'May', revenue: 9180 },
];

const statusData = [
  { name: 'Paid', value: 3, color: '#10b981' },
  { name: 'Pending', value: 1, color: '#f59e0b' },
  { name: 'Overdue', value: 1, color: '#ef4444' },
];

// Add interfaces for type safety
interface Payment {
  id: number;
  customer: string;
  amount: number;
  status: string;
  date: string;
  method: string;
}

interface Customer {
  id: number;
  name: string;
  logo: string;
  contact: string;
  email: string;
  phone: string;
  since: string;
  totalSpent: number;
  projects: number;
  status: string;
  industry: string;
  location: string;
  lastPayment: string;
  segment?: string;
}

// TypeScript workaround for Recharts JSX errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const XAxisAny: any = XAxis;
const YAxisAny: any = YAxis;
const TooltipAny: any = Tooltip;
const BarAny: any = Bar;
const PieAny: any = Pie;
const PieChartAny: any = PieChart;
const BarChartAny: any = BarChart;
const ResponsiveContainerAny: any = ResponsiveContainer;
const CartesianGridAny: any = CartesianGrid;
const CellAny: any = Cell;
const LegendAny: any = Legend;

const Payments = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [expandedView, setExpandedView] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerViewMode, setCustomerViewMode] = useState<string>('grid');
  const [customerSortBy, setCustomerSortBy] = useState<string>('name');
  const [customerSegment, setCustomerSegment] = useState<string>('all');
  const [viewPaymentModal, setViewPaymentModal] = useState(false);
  const [modalPayment, setModalPayment] = useState<Payment | null>(null);
  const [paymentsSearch, setPaymentsSearch] = useState('');
  const [paymentsStatusFilter, setPaymentsStatusFilter] = useState('all');
  const [showPaymentsStatusMenu, setShowPaymentsStatusMenu] = useState(false);
  const customersListRef = useRef<HTMLDivElement | null>(null);
  const customerGridRef = useRef<HTMLDivElement | null>(null);
  
  // Get customer segment based on data
  const getCustomerSegment = (customer: Customer): string => {
    // High-value: Spent over 20k
    if (customer.totalSpent > 20000) return 'high-value';
    // New: Customer for less than 3 months
    if ((+new Date() - +new Date(customer.since)) / (1000 * 60 * 60 * 24 * 30) < 3) return 'new';
    // At-risk: No activity in last 3 months
    if ((+new Date() - +new Date(customer.lastPayment)) / (1000 * 60 * 60 * 24 * 30) > 3) return 'at-risk';
    // Regular customer
    return 'regular';
  };
  
  // Assign segment to each customer
  const customersWithSegments = customerData.map(customer => ({
    ...customer,
    segment: getCustomerSegment(customer)
  }));
  
  // Calculate segment counts
  const segmentCounts = {
    total: customersWithSegments.length,
    'high-value': customersWithSegments.filter(c => c.segment === 'high-value').length,
    'new': customersWithSegments.filter(c => c.segment === 'new').length,
    'at-risk': customersWithSegments.filter(c => c.segment === 'at-risk').length,
    'regular': customersWithSegments.filter(c => c.segment === 'regular').length
  };
  
  // Handler for viewing payment details
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };
  
  // Handler for closing payment detail view
  const handleClosePaymentDetail = () => {
    setShowPaymentDetail(false);
    setSelectedPayment(null);
  };
  
  // Handler for viewing customer details
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };
  
  // Handler for closing customer detail view
  const handleCloseCustomerDetail = () => {
    setShowCustomerDetail(false);
    setSelectedCustomer(null);
  };
  
  // Filter customers based on search term, status and segment
  const filteredCustomers = customersWithSegments.filter((customer: Customer) => {
    // Filter by status if not "all"
    if (filterStatus !== 'all' && customer.status !== filterStatus) {
      return false;
    }
    
    // Filter by segment if not "all"
    if (customerSegment !== 'all' && customer.segment !== customerSegment) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !customer.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !customer.industry.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a: Customer, b: Customer) => {
    // Sort based on selected sort option
    switch(customerSortBy) {
      case 'spent':
        return b.totalSpent - a.totalSpent;
      case 'projects':
        return b.projects - a.projects;
      case 'recent':
        return +new Date(b.lastPayment) - +new Date(a.lastPayment);
      default: // 'name'
        return a.name.localeCompare(b.name);
    }
  });
  
  // Filter payments based on status and search term
  const filteredPayments = paymentData.filter(payment => {
    const search = paymentsSearch.toLowerCase();
    const matchesSearch =
      payment.customer.toLowerCase().includes(search) ||
      payment.method.toLowerCase().includes(search) ||
      (`REF-${payment.id}-20250510`).toLowerCase().includes(search);
    const matchesStatus =
      paymentsStatusFilter === 'all' || payment.status === paymentsStatusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Detail views for expandable cards
  const renderExpandedView = () => {
    switch(expandedView) {
      case 'revenue':
        return (
          <div className="payments-expanded-card">
            <div className="expanded-header" style={{ justifyContent: 'space-between' }}>
              <span className="expanded-title" style={{ fontSize: '2rem', fontWeight: 800, color: '#23236a', textAlign: 'left' }}>Revenue Breakdown</span>
              <button className="expanded-close" onClick={() => setExpandedView(null)} style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>Close</button>
            </div>
            <div className="revenue-breakdown-cards">
              <div className="revenue-breakdown-card">
                <div className="revenue-breakdown-label">Q1 2025</div>
                <div className="revenue-breakdown-value">$49,400</div>
              </div>
              <div className="revenue-breakdown-card">
                <div className="revenue-breakdown-label">Q2 2025 (MTD)</div>
                <div className="revenue-breakdown-value">$28,580</div>
              </div>
              <div className="revenue-breakdown-card">
                <div className="revenue-breakdown-label">YoY Growth</div>
                <div className="revenue-breakdown-value" style={{ color: '#16a34a' }}>+18%</div>
              </div>
            </div>
            <div className="expanded-table-title" style={{ textAlign: 'left', marginTop: 32, marginBottom: 12, fontSize: '1.2rem' }}>Revenue by Payment Method</div>
            <table className="expanded-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Credit Card</td>
                  <td>$31,920</td>
                  <td>41%</td>
                </tr>
                <tr>
                  <td>Bank Transfer</td>
                  <td>$27,300</td>
                  <td>35%</td>
                </tr>
                <tr>
                  <td>PayPal</td>
                  <td>$18,760</td>
                  <td>24%</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'outstanding':
        return (
          <div className="payments-expanded-card">
            <div className="expanded-header">
              <span className="expanded-title">Outstanding Payments</span>
              <button className="expanded-close" onClick={() => setExpandedView(null)}>×</button>
            </div>
            <div className="expanded-content">
              <table className="expanded-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Invoice #</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>SmartSolutions</td>
                    <td>INV-2025-042</td>
                    <td>$2,100</td>
                    <td>May 1, 2025</td>
                    <td style={{ color: '#ef4444', fontWeight: 600 }}>12</td>
                    <td><button className="payments-btn" style={{ padding: '4px 12px', fontSize: '0.95rem' }}>Send Reminder</button></td>
                  </tr>
                  <tr>
                    <td>TechGiant Inc</td>
                    <td>INV-2025-049</td>
                    <td>$3,400</td>
                    <td>May 12, 2025</td>
                    <td style={{ color: '#fbbf24', fontWeight: 600 }}>1</td>
                    <td><button className="payments-btn" style={{ padding: '4px 12px', fontSize: '0.95rem' }}>Send Reminder</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'monthly':
        return (
          <div className="payments-expanded-card">
            <div className="expanded-header">
              <span className="expanded-title">Payments Received This Month</span>
              <button className="expanded-close" onClick={() => setExpandedView(null)}>×</button>
            </div>
            <div className="expanded-content">
              <table className="expanded-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Invoice #</th>
                    <th>Amount</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>May 10, 2025</td>
                    <td>Acme Corp</td>
                    <td>INV-2025-045</td>
                    <td>$1,250</td>
                    <td>Credit Card</td>
                  </tr>
                  <tr>
                    <td>May 9, 2025</td>
                    <td>Innovate LLC</td>
                    <td>INV-2025-044</td>
                    <td>$1,650</td>
                    <td>Bank Transfer</td>
                  </tr>
                  <tr>
                    <td>May 8, 2025</td>
                    <td>GlobalServices</td>
                    <td>INV-2025-043</td>
                    <td>$780</td>
                    <td>PayPal</td>
                  </tr>
                  <tr>
                    <td>May 5, 2025</td>
                    <td>DataTech Solutions</td>
                    <td>INV-2025-041</td>
                    <td>$3,100</td>
                    <td>Bank Transfer</td>
                  </tr>
                  <tr>
                    <td>May 2, 2025</td>
                    <td>Cloudera Inc</td>
                    <td>INV-2025-039</td>
                    <td>$2,400</td>
                    <td>Credit Card</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="payments-expanded-card">
            <div className="expanded-header">
              <span className="expanded-title">Active Customers</span>
              <button className="expanded-close" onClick={() => setExpandedView(null)}>×</button>
            </div>
            <div className="expanded-content">
              <table className="expanded-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Customer Since</th>
                    <th>Projects</th>
                    <th>Total Spent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Acme Corp</td>
                    <td>Jan 2023</td>
                    <td>5</td>
                    <td>$24,500</td>
                    <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                  </tr>
                  <tr>
                    <td>TechGiant Inc</td>
                    <td>Mar 2024</td>
                    <td>2</td>
                    <td>$18,900</td>
                    <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                  </tr>
                  <tr>
                    <td>GlobalServices</td>
                    <td>Sep 2022</td>
                    <td>8</td>
                    <td>$42,800</td>
                    <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                  </tr>
                  <tr>
                    <td>SmartSolutions</td>
                    <td>Apr 2025</td>
                    <td>1</td>
                    <td>$2,100</td>
                    <td><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">New</span></td>
                  </tr>
                  <tr>
                    <td>Innovate LLC</td>
                    <td>Nov 2023</td>
                    <td>4</td>
                    <td>$15,200</td>
                    <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid': return <Check className="text-green-500" size={18} />;
      case 'pending': return <Clock className="text-amber-500" size={18} />;
      case 'overdue': return <AlertTriangle className="text-red-500" size={18} />;
      default: return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper to scroll to customers list on mobile
  const scrollToCustomersList = () => {
    if (window.matchMedia && window.matchMedia('(max-width: 700px)').matches && customersListRef.current) {
      customersListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to scroll to customers grid view (now for all viewports)
  const scrollToCustomerGrid = () => {
    if (customerGridRef.current) {
      customerGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="payments-page">
      <div className="payments-header">Customer Payment Management</div>
      <div className="payments-tabs" style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button className={activeTab === 'dashboard' ? 'payments-tab-active' : 'payments-tab'} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'payments' ? 'payments-tab-active' : 'payments-tab'} onClick={() => setActiveTab('payments')}>Payments</button>
        <button className={activeTab === 'customers' ? 'payments-tab-active' : 'payments-tab'} onClick={() => setActiveTab('customers')}>Customers</button>
        <button className={activeTab === 'reports' ? 'payments-tab-active' : 'payments-tab'} onClick={() => setActiveTab('reports')}>Reports</button>
      </div>
      {activeTab === 'dashboard' && (
        <>
          <div className="payments-dashboard-grid">
            <div className="payments-card dashboard-card-hover" style={{ cursor: 'pointer' }} onClick={() => setExpandedView('revenue')}>
              <div className="payments-card-title">Total Revenue</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#23236a' }}>$77,980</div>
              <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 16, marginTop: 4 }}>+12% from last month</div>
            </div>
            <div className="payments-card dashboard-card-hover" style={{ cursor: 'pointer' }} onClick={() => setExpandedView('outstanding')}>
              <div className="payments-card-title">Outstanding Payments</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#23236a' }}>$5,500</div>
              <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 16, marginTop: 4 }}>3 payments due</div>
            </div>
            <div className="payments-card dashboard-card-hover" style={{ cursor: 'pointer' }} onClick={() => setExpandedView('monthly')}>
              <div className="payments-card-title">Paid This Month</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#23236a' }}>$9,180</div>
              <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 16, marginTop: 4 }}>5 payments received</div>
            </div>
            <div className="payments-card dashboard-card-hover" style={{ cursor: 'pointer' }} onClick={() => setExpandedView('customers')}>
              <div className="payments-card-title">Active Customers</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#23236a' }}>28</div>
              <div style={{ color: '#2563eb', fontWeight: 600, fontSize: 16, marginTop: 4 }}>+2 new this month</div>
            </div>
          </div>
          {expandedView && renderExpandedView()}
          <div className="dashboard-charts-row">
            <div className="payments-chart-card" style={{ flex: 2 }}>
              <div className="payments-card-title" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Monthly Revenue</div>
              <ResponsiveContainerAny width="100%" height={300}>
                <BarChartAny data={monthlyData} margin={{ top: 16, right: 24, left: 40, bottom: 8 }}>
                  <defs>
                    <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4094f7" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGridAny strokeDasharray="3 3" vertical={false} stroke="#e5eaf1" />
                  <XAxisAny dataKey="month" tick={{ fontSize: 18, fill: '#23236a', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxisAny tick={{ fontSize: 18, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v.toLocaleString()}`}/>
                  <TooltipAny content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{ background: '#fff', border: '1.5px solid #e5eaf1', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px #e5eaf1' }}>
                          <div style={{ fontWeight: 700, color: '#23236a', fontSize: 16 }}>{payload[0].payload.month}</div>
                          <div style={{ color: '#2563eb', fontWeight: 700, fontSize: 18 }}>${payload[0].payload.revenue.toLocaleString()}</div>
                        </div>
                      );
                    }
                    return null;
                  }} cursor={{ fill: '#f1f5f9' }} />
                  <BarAny dataKey="revenue" fill="url(#barBlue)" radius={[12, 12, 8, 8]} barSize={48} />
                </BarChartAny>
              </ResponsiveContainerAny>
            </div>
            <div className="payments-chart-card" style={{ flex: 1 }}>
              <div className="payments-card-title" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Payment Status</div>
              <ResponsiveContainerAny width="100%" height={300}>
                <PieChartAny>
                  <PieAny
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    labelLine={true}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
                      // Calculate label position
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 24;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      let label = '';
                      let fill = '#23236a';
                      if (name === 'Paid') {
                        label = `Paid ${Math.round(percent * 100)}%`;
                        fill = '#10b981';
                      } else if (name === 'Pending') {
                        label = `Pending ${Math.round(percent * 100)}%`;
                        fill = '#f59e0b';
                      } else if (name === 'Overdue') {
                        label = `Overdue ${value}`;
                        fill = '#ef4444';
                      }
                      return (
                        <text x={x} y={y} fill={fill} fontSize={18} fontWeight={700} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                          {label}
                        </text>
                      );
                    }}
                    stroke="#fff"
                    strokeWidth={3}
                    isAnimationActive={true}
                  >
                    {statusData.map((entry, idx) => (
                      <CellAny key={`cell-${idx}`} fill={entry.color} filter="url(#pieShadow)" />
                    ))}
                  </PieAny>
                  <defs>
                    <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#e5eaf1"/>
                    </filter>
                  </defs>
                  <TooltipAny content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                    if (active && payload && payload.length) {
                      const { name, value } = payload[0].payload;
                      return (
                        <div style={{ background: '#fff', border: '1.5px solid #e5eaf1', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px #e5eaf1' }}>
                          <div style={{ fontWeight: 700, color: '#23236a', fontSize: 16 }}>{name}</div>
                          <div style={{ color: payload[0].color, fontWeight: 700, fontSize: 18 }}>{value}</div>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <LegendAny verticalAlign="bottom" iconType="circle" formatter={(value: string) => <span style={{ color: '#23236a', fontWeight: 600, fontSize: 16 }}>{value}</span>} />
                </PieChartAny>
              </ResponsiveContainerAny>
            </div>
          </div>
          <div className="payments-table-card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <div className="payments-searchbar">
                <Search size={16} style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="payments-filter-btn" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <Filter size={16} />
                {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                <ChevronDown size={16} />
              </button>
              {/* Filter dropdown remains unchanged */}
            </div>
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer: Customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>${customer.totalSpent.toLocaleString()}</td>
                      <td>
                        <span className={`payments-status payments-status-${customer.status}`}>
                          <span className="payments-status-icon"></span>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td>{formatDate(customer.lastPayment)}</td>
                      <td>{customer.industry}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No customers match your current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="payments-muted" style={{ marginTop: 12 }}>{filteredCustomers.length} customers</div>
            <button className="payments-btn" style={{ marginTop: 12 }}>View all customers</button>
          </div>
        </>
      )}
      {activeTab === 'payments' && (
        <div className="payments-table-card" style={{ marginTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#23236a' }}>All Payments</div>
            <button style={{ background: '#f8fafc', border: '1.5px solid #e5eaf1', borderRadius: 10, padding: '8px 18px', fontWeight: 600, color: '#23236a', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Download size={18} style={{ marginRight: 6 }} /> Export
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginBottom: 16, position: 'relative' }}>
            <div className="payments-searchbar" style={{ width: 260 }}>
              <Search size={16} style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search payments..."
                style={{ width: '100%' }}
                value={paymentsSearch}
                onChange={e => setPaymentsSearch(e.target.value)}
              />
            </div>
            <button
              className="payments-filter-btn"
              style={{ minWidth: 120 }}
              onClick={() => setShowPaymentsStatusMenu(v => !v)}
            >
              {paymentsStatusFilter === 'all' ? 'All Status' : paymentsStatusFilter.charAt(0).toUpperCase() + paymentsStatusFilter.slice(1)} <ChevronDown size={16} />
            </button>
            {showPaymentsStatusMenu && (
              <div style={{ position: 'absolute', right: 0, top: 44, background: '#fff', border: '1.5px solid #e5eaf1', borderRadius: 10, boxShadow: '0 2px 8px #e5eaf1', zIndex: 10, minWidth: 140 }}>
                {['all', 'paid', 'pending', 'overdue'].map(status => (
                  <div
                    key={status}
                    onClick={() => { setPaymentsStatusFilter(status); setShowPaymentsStatusMenu(false); }}
                    style={{ padding: '10px 18px', cursor: 'pointer', color: paymentsStatusFilter === status ? '#2563eb' : '#23236a', fontWeight: paymentsStatusFilter === status ? 700 : 500, background: paymentsStatusFilter === status ? '#f1f5f9' : '#fff' }}
                  >
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>METHOD</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, idx) => (
                <tr key={payment.id}>
                  <td
                    style={{ color: '#64748b', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => { setModalPayment(payment); setViewPaymentModal(true); }}
                    className="payments-table-clickable"
                  >
                    #{(payment.id).toString().padStart(5, '0')}
                  </td>
                  <td
                    style={{ fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => { setModalPayment(payment); setViewPaymentModal(true); }}
                    className="payments-table-clickable"
                  >
                    {payment.customer}
                  </td>
                  <td
                    style={{ fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => { setModalPayment(payment); setViewPaymentModal(true); }}
                    className="payments-table-clickable"
                  >
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setModalPayment(payment); setViewPaymentModal(true); }}
                    className="payments-table-clickable"
                  >
                    {payment.status === 'paid' && <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={18} style={{ marginRight: 2 }} />Paid</span>}
                    {payment.status === 'pending' && <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={18} style={{ marginRight: 2 }} />Pending</span>}
                    {payment.status === 'overdue' && <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={18} style={{ marginRight: 2 }} />Overdue</span>}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setModalPayment(payment); setViewPaymentModal(true); }}
                    className="payments-table-clickable"
                  >
                    {formatDate(payment.date)}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setModalPayment(payment); setViewPaymentModal(true); }}
                    className="payments-table-clickable"
                  >
                    {payment.method}
                  </td>
                  <td>
                    <a href="#" style={{ color: '#2563eb', fontWeight: 600, marginRight: 12 }} onClick={e => { e.preventDefault(); setModalPayment(payment); setViewPaymentModal(true); }}>View</a>
                    <a href="#" style={{ color: '#2563eb', fontWeight: 600 }}>Edit</a>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '32px 0', fontSize: 17 }}>No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div style={{ color: '#64748b', fontSize: 15 }}>Showing {filteredPayments.length} of {paymentData.length} payments</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled style={{ background: '#f1f5f9', color: '#b0b7c3', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'not-allowed' }}>Previous</button>
              <button disabled style={{ background: '#f1f5f9', color: '#b0b7c3', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'not-allowed' }}>Next</button>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'customers' && (
        <>
          <div className="customer-segments-row" style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            <div
              className={`customer-segment-card${customerSegment === 'all' ? ' active segment-all' : ''}`}
              onClick={() => { setCustomerSegment('all'); scrollToCustomerGrid(); }}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, color: '#23236a', marginBottom: 2 }}>All Customers</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb', marginBottom: 2 }}>{segmentCounts.total}</div>
              <div style={{ color: '#64748b', fontWeight: 500, fontSize: 15 }}>All</div>
              <div style={{ height: 6, background: '#e5eaf1', borderRadius: 4, marginTop: 10 }}>
                <div style={{ width: '100%', height: '100%', background: '#2563eb', borderRadius: 4 }} />
              </div>
            </div>
            <div
              className={`customer-segment-card${customerSegment === 'high-value' ? ' active segment-high-value' : ''}`}
              onClick={() => { setCustomerSegment('high-value'); scrollToCustomerGrid(); }}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, color: '#23236a', marginBottom: 2 }}>High-Value</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e', marginBottom: 2 }}>{segmentCounts['high-value']}</div>
              <div style={{ color: '#22c55e', fontWeight: 500, fontSize: 15 }}>Top spenders</div>
              <div style={{ height: 6, background: '#e5eaf1', borderRadius: 4, marginTop: 10 }}>
                <div style={{ width: `${segmentCounts['high-value'] / segmentCounts.total * 100}%`, height: '100%', background: '#22c55e', borderRadius: 4 }} />
              </div>
            </div>
            <div
              className={`customer-segment-card${customerSegment === 'regular' ? ' active segment-regular' : ''}`}
              onClick={() => { setCustomerSegment('regular'); scrollToCustomerGrid(); }}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, color: '#23236a', marginBottom: 2 }}>Regular</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#6366f1', marginBottom: 2 }}>{segmentCounts['regular']}</div>
              <div style={{ color: '#6366f1', fontWeight: 500, fontSize: 15 }}>Steady clients</div>
              <div style={{ height: 6, background: '#e5eaf1', borderRadius: 4, marginTop: 10 }}>
                <div style={{ width: `${segmentCounts['regular'] / segmentCounts.total * 100}%`, height: '100%', background: '#6366f1', borderRadius: 4 }} />
              </div>
            </div>
            <div
              className={`customer-segment-card${customerSegment === 'new' ? ' active segment-new' : ''}`}
              onClick={() => { setCustomerSegment('new'); scrollToCustomerGrid(); }}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, color: '#23236a', marginBottom: 2 }}>New Customers</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fbbf24', marginBottom: 2 }}>{segmentCounts['new']}</div>
              <div style={{ color: '#fbbf24', fontWeight: 500, fontSize: 15 }}>Last 3 months</div>
              <div style={{ height: 6, background: '#e5eaf1', borderRadius: 4, marginTop: 10 }}>
                <div style={{ width: `${segmentCounts['new'] / segmentCounts.total * 100}%`, height: '100%', background: '#fbbf24', borderRadius: 4 }} />
              </div>
            </div>
            <div
              className={`customer-segment-card${customerSegment === 'at-risk' ? ' active segment-at-risk' : ''}`}
              onClick={() => { setCustomerSegment('at-risk'); scrollToCustomerGrid(); }}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, color: '#23236a', marginBottom: 2 }}>At Risk</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444', marginBottom: 2 }}>{segmentCounts['at-risk']}</div>
              <div style={{ color: '#ef4444', fontWeight: 500, fontSize: 15 }}>Needs attention</div>
              <div style={{ height: 6, background: '#e5eaf1', borderRadius: 4, marginTop: 10 }}>
                <div style={{ width: `${segmentCounts['at-risk'] / segmentCounts.total * 100}%`, height: '100%', background: '#ef4444', borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <div ref={customersListRef}>
            <div className="customer-summary-row" style={{ display: 'flex', gap: 24, marginBottom: 32, alignItems: 'stretch', position: 'relative' }}>
              {/* Customer Lifetime Value Card */}
              <div className="customer-ltv-card dashboard-card-hover" style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px #e5eaf1', padding: '32px 28px 28px 28px', display: 'flex', flexDirection: 'row', alignItems: 'stretch', minWidth: 0, position: 'relative' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#23236a', marginBottom: 0, minHeight: 28, display: 'flex', alignItems: 'center' }}>Customer Lifetime Value</div>
                  <div style={{ borderBottom: '1px solid #e5eaf1', margin: '18px 0 24px 0' }} />
                  <div style={{ fontSize: 38, fontWeight: 800, color: '#23236a', marginBottom: 2 }}>$20,686</div>
                  <div style={{ color: '#64748b', fontWeight: 500, fontSize: 18, marginBottom: 32 }}>Average per customer</div>
                  <div style={{ color: '#64748b', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Top Customer LTV</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a', marginBottom: 8 }}>$42,800</div>
                  <div style={{ color: '#64748b', fontWeight: 700, fontSize: 18 }}>Avg. Projects per Customer</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a' }}>4.1</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ background: '#e7f2fd', borderRadius: '50%', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 24 }}>
                    <svg width="44" height="44" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e7f2fd"/><circle cx="12" cy="12" r="7" stroke="#2563eb" strokeWidth="2"/><path d="M12 8v4M12 16h0" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><path d="M9.5 13c0 1.104.896 2 2 2s2-.896 2-2-.896-2-2-2-2 .896-2 2Z" stroke="#2563eb" strokeWidth="2"/></svg>
                  </div>
                </div>
              </div>
              {/* Customer Retention Card */}
              <div className="customer-retention-card dashboard-card-hover" style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px #e5eaf1', padding: '32px 28px 28px 28px', display: 'flex', flexDirection: 'row', alignItems: 'stretch', minWidth: 0, position: 'relative' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#23236a', marginBottom: 0, minHeight: 28, display: 'flex', alignItems: 'center' }}>Customer Retention</div>
                  <div style={{ borderBottom: '1px solid #e5eaf1', margin: '18px 0 24px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ color: '#64748b', fontWeight: 700, fontSize: 18 }}>Avg. Relationship Length</div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a' }}>1.7 years</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div style={{ color: '#64748b', fontWeight: 700, fontSize: 18 }}>Returning Customers</div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a' }}>88%</div>
                    </div>
                  </div>
                  <div style={{ color: '#64748b', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Retention Rate</div>
                  <div style={{ fontWeight: 800, fontSize: 28, color: '#23236a' }}>92%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ background: '#e7f9ef', borderRadius: '50%', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 24 }}>
                    <svg width="44" height="44" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e7f9ef"/><path d="M17 9.5V15.5C17 16.3284 16.3284 17 15.5 17H8.5C7.67157 17 7 16.3284 7 15.5V9.5M12 13.5L14.5 11M12 13.5L9.5 11M12 13.5V7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
              {/* Payment Status Card */}
              <div className="payment-status-card dashboard-card-hover" style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px #e5eaf1', padding: '32px 28px 28px 28px', display: 'flex', flexDirection: 'row', alignItems: 'stretch', minWidth: 0, position: 'relative' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#23236a', marginBottom: 0, minHeight: 28, display: 'flex', alignItems: 'center' }}>Payment Status</div>
                  <div style={{ borderBottom: '1px solid #e5eaf1', margin: '18px 0 24px 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 8, background: '#e5eaf1', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: '60%', height: '100%', background: '#22c55e', borderRadius: 4 }} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a', minWidth: 44, textAlign: 'right' }}>60%</div>
                      <div style={{ color: '#23236a', fontWeight: 700, fontSize: 18, marginLeft: 6, minWidth: 70 }}>Paid</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 8, background: '#e5eaf1', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: '20%', height: '100%', background: '#fbbf24', borderRadius: 4 }} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a', minWidth: 44, textAlign: 'right' }}>20%</div>
                      <div style={{ color: '#23236a', fontWeight: 700, fontSize: 18, marginLeft: 6, minWidth: 70 }}>Pending</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 8, background: '#e5eaf1', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: '20%', height: '100%', background: '#ef4444', borderRadius: 4 }} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: '#23236a', minWidth: 44, textAlign: 'right' }}>20%</div>
                      <div style={{ color: '#23236a', fontWeight: 700, fontSize: 18, marginLeft: 6, minWidth: 70 }}>Overdue</div>
                    </div>
                  </div>
                  <div style={{ color: '#64748b', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>On-Time Payments</div>
                  <div style={{ fontWeight: 800, fontSize: 28, color: '#23236a' }}>84%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ background: '#f3eaff', borderRadius: '50%', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 24 }}>
                    <svg width="44" height="44" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3eaff"/><path d="M12 8v4l3 2" stroke="#a084ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="7" stroke="#a084ee" strokeWidth="2"/></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="payments-table-card">
              <div className="customers-controls-row">
                <div className="payments-searchbar">
                  <Search size={16} style={{ color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="Search customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="payments-filter-btn" onClick={() => setShowFilterMenu(!showFilterMenu)}>
                    <Filter size={16} />
                    {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    <ChevronDown size={16} />
                  </button>
                  {showFilterMenu && (
                    <div style={{ position: 'absolute', top: 44, left: 0, background: '#fff', border: '1.5px solid #e5eaf1', borderRadius: 10, boxShadow: '0 2px 8px #e5eaf1', zIndex: 10, minWidth: 140 }}>
                      {['all', 'active', 'new', 'at-risk'].map(status => (
                        <div
                          key={status}
                          onClick={() => { setFilterStatus(status); setShowFilterMenu(false); }}
                          style={{ padding: '10px 18px', cursor: 'pointer', color: filterStatus === status ? '#2563eb' : '#23236a', fontWeight: filterStatus === status ? 700 : 500, background: filterStatus === status ? '#f1f5f9' : '#fff' }}
                        >
                          {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginLeft: 12 }}>
                  <button
                    className={`payments-filter-btn${customerViewMode === 'grid' ? ' active' : ''}`}
                    style={{ marginRight: 4 }}
                    onClick={() => setCustomerViewMode('grid')}
                    title="Grid view"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill={customerViewMode === 'grid' ? '#2563eb' : '#cbd5e1'} /><rect x="14" y="3" width="7" height="7" rx="2" fill={customerViewMode === 'grid' ? '#2563eb' : '#cbd5e1'} /><rect x="3" y="14" width="7" height="7" rx="2" fill={customerViewMode === 'grid' ? '#2563eb' : '#cbd5e1'} /><rect x="14" y="14" width="7" height="7" rx="2" fill={customerViewMode === 'grid' ? '#2563eb' : '#cbd5e1'} /></svg>
                  </button>
                  <button
                    className={`payments-filter-btn${customerViewMode === 'table' ? ' active' : ''}`}
                    onClick={() => setCustomerViewMode('table')}
                    title="Table view"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="3" rx="1.5" fill={customerViewMode === 'table' ? '#2563eb' : '#cbd5e1'} /><rect x="3" y="10.5" width="18" height="3" rx="1.5" fill={customerViewMode === 'table' ? '#2563eb' : '#cbd5e1'} /><rect x="3" y="16" width="18" height="3" rx="1.5" fill={customerViewMode === 'table' ? '#2563eb' : '#cbd5e1'} /></svg>
                  </button>
                </div>
              </div>
              {customerViewMode === 'grid' ? (
                <div className="customer-grid-view" ref={customerGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 18 }}>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer: Customer) => (
                      <div key={customer.id} className="customer-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5eaf1', padding: 24, borderTop: `4px solid ${customer.segment === 'high-value' ? '#22c55e' : customer.segment === 'regular' ? '#6366f1' : customer.segment === 'new' ? '#fbbf24' : customer.segment === 'at-risk' ? '#ef4444' : '#2563eb'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: '#fff', backgroundColor: customer.segment === 'high-value' ? '#22c55e' : customer.segment === 'regular' ? '#6366f1' : customer.segment === 'new' ? '#fbbf24' : customer.segment === 'at-risk' ? '#ef4444' : '#2563eb' }}>{customer.logo}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 19, color: '#23236a' }}>{customer.name}</div>
                            <div style={{ color: '#64748b', fontWeight: 500, fontSize: 15 }}>{customer.industry} • {customer.location}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
                          <div>
                            <div style={{ color: '#64748b', fontSize: 14 }}>Total Spent</div>
                            <div style={{ fontWeight: 700, fontSize: 17 }}>${customer.totalSpent.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', fontSize: 14 }}>Projects</div>
                            <div style={{ fontWeight: 700, fontSize: 17 }}>{customer.projects}</div>
                          </div>
                        </div>
                        <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>Customer Since <span style={{ fontWeight: 600, color: '#23236a' }}>{formatDate(customer.since)}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span className={`payments-status payments-status-${customer.status}`}>{customer.status === 'active' ? <span className="payments-status-icon"></span> : null}{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>Last payment: {formatDate(customer.lastPayment)}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button className="payments-filter-btn" style={{ fontWeight: 600, fontSize: 15, padding: '6px 18px' }}>Message</button>
                          <button className="payments-btn" style={{ fontWeight: 600, fontSize: 15, padding: '6px 18px' }}>View</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b', fontSize: 17, padding: '32px 0' }}>No customers match your current filters</div>
                  )}
                </div>
              ) : (
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Since</th>
                      <th>Total Spent</th>
                      <th>Projects</th>
                      <th>Status</th>
                      <th>Last Activity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer: Customer) => (
                        <tr key={customer.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', backgroundColor: customer.segment === 'high-value' ? '#22c55e' : customer.segment === 'regular' ? '#6366f1' : customer.segment === 'new' ? '#fbbf24' : customer.segment === 'at-risk' ? '#ef4444' : '#2563eb' }}>{customer.logo}</div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 16, color: '#23236a' }}>{customer.name}</div>
                                <div style={{ color: '#64748b', fontWeight: 500, fontSize: 13 }}>{customer.industry}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: '#23236a' }}>{customer.contact}</div>
                            <div style={{ color: '#64748b', fontSize: 13 }}>{customer.email}</div>
                          </td>
                          <td>{formatDate(customer.since)}</td>
                          <td style={{ fontWeight: 700 }}>${customer.totalSpent.toLocaleString()}</td>
                          <td>{customer.projects}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span className={`payments-status payments-status-${customer.status}`}>{customer.status === 'active' ? <span className="payments-status-icon"></span> : null}{customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</span>
                              <span style={{ fontSize: 12, color: customer.segment === 'high-value' ? '#22c55e' : customer.segment === 'regular' ? '#6366f1' : customer.segment === 'new' ? '#fbbf24' : customer.segment === 'at-risk' ? '#ef4444' : '#2563eb', fontWeight: 700 }}>{customer.segment === 'high-value' ? 'High Value' : customer.segment === 'regular' ? 'Regular' : customer.segment === 'new' ? 'New Client' : customer.segment === 'at-risk' ? 'At Risk' : ''}</span>
                            </div>
                          </td>
                          <td>{formatDate(customer.lastPayment)}</td>
                          <td>
                            <button className="payments-filter-btn" style={{ fontWeight: 600, fontSize: 15, padding: '6px 18px', marginRight: 4 }}>Message</button>
                            <button className="payments-btn" style={{ fontWeight: 600, fontSize: 15, padding: '6px 18px' }}>View</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          No customers match your current filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              <div className="payments-muted" style={{ marginTop: 12 }}>{filteredCustomers.length} customers</div>
              <button className="payments-btn" style={{ marginTop: 12 }}>View all customers</button>
            </div>
          </div>
        </>
      )}
      {/* Payment Details Modal */}
      {viewPaymentModal && modalPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(37,99,235,0.18), 0 2px 8px rgba(0,0,0,0.10)', width: 540, maxWidth: '95vw', padding: '32px 36px 24px 36px', position: 'relative' }}>
            <button onClick={() => setViewPaymentModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#64748b', cursor: 'pointer' }}>&times;</button>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#23236a', marginBottom: 18 }}>Payment Details #{modalPayment?.id?.toString().padStart(5, '0')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Customer</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#23236a' }}>{modalPayment?.customer}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Amount</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: '#23236a' }}>${modalPayment?.amount?.toLocaleString()}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Status</div>
                <div style={{ fontWeight: 700, color: modalPayment?.status === 'paid' ? '#10b981' : modalPayment?.status === 'pending' ? '#f59e0b' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {modalPayment?.status === 'paid' && <Check size={18} />} 
                  {modalPayment?.status === 'overdue' && <AlertTriangle size={18} />} 
                  {modalPayment?.status?.charAt(0).toUpperCase() + modalPayment?.status?.slice(1)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Payment Date</div>
                <div style={{ fontWeight: 700, color: '#23236a' }}>{formatDate(modalPayment?.date)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Payment Method</div>
                <div style={{ fontWeight: 700, color: '#23236a' }}>{modalPayment?.method}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15 }}>Reference Number</div>
                <div style={{ fontWeight: 700, color: '#23236a' }}>REF-{modalPayment?.id}-20250510</div>
              </div>
            </div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Payment Timeline</div>
            <div style={{ borderLeft: '2px solid #e5eaf1', marginLeft: 8, paddingLeft: 24, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <Check size={22} color="#10b981" style={{ marginRight: 10 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#23236a' }}>Payment Received</div>
                  <div style={{ color: '#64748b', fontSize: 15 }}>May 10, 2025</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <MailIcon size={22} color="#2563eb" style={{ marginRight: 10 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#23236a' }}>Invoice Sent</div>
                  <div style={{ color: '#64748b', fontSize: 15 }}>May 3, 2025</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={22} color="#a084ee" style={{ marginRight: 10 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#23236a' }}>Project Completed</div>
                  <div style={{ color: '#64748b', fontSize: 15 }}>Apr 26, 2025</div>
                </div>
              </div>
            </div>
            <div style={{ background: '#e7faed', color: '#23236a', borderRadius: 10, padding: 18, fontSize: 15, marginBottom: 18, border: '1.5px solid #b6e4c7' }}>
              <b>Additional Information</b><br />
              Payment successfully received for Project #{modalPayment?.id}. Transaction processed through {modalPayment?.method} with confirmation number CN-931939.<br />
              Receipt has been automatically generated and sent to the customer. Payment has been reconciled in the accounting system on {formatDate(modalPayment?.date)}.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setViewPaymentModal(false)} style={{ background: '#f1f5f9', color: '#23236a', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, marginRight: 8, cursor: 'pointer' }}>Close</button>
              <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Download Receipt</button>
            </div>
          </div>
        </div>
      )}
      {/* Other tabs (Payments, Customers, Reports) can be refactored similarly */}
    </div>
  );
};

export default Payments; 