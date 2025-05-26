import React, { useState } from 'react';
import logo from '../logo.svg';

// Helper to get query params
function useQuery() {
  return new URLSearchParams(window.location.search);
}

// Print-specific styles to hide non-invoice elements
const printStyles = `
  @media print {
    body * {
      visibility: hidden !important;
    }
    .invoice-print-area, .invoice-print-area * {
      visibility: visible !important;
    }
    .invoice-print-area {
      position: absolute !important;
      left: 0; top: 0; width: 100vw; min-height: 100vh;
      background: #fff !important;
      margin: 0 !important; padding: 0 !important;
      box-shadow: none !important;
    }
    .no-print {
      display: none !important;
    }
  }
`;

const PaymentsInvoice: React.FC = () => {
  const query = useQuery();
  const clientName = query.get('clientName') || 'Client Name';
  const clientCompany = query.get('clientCompany') || 'Client Company';
  const clientEmail = query.get('clientEmail') || 'Client Email';
  const clientAddress = query.get('clientAddress') || 'Client Address';
  const project = query.get('project') || 'Project Name';
  const invoiceNumber = query.get('invoiceNumber') || '00000';
  const issuedOn = query.get('issuedOn') || '---';
  const paymentDate = query.get('paidDate') || '---';
  const reference = query.get('reference') || 'P.O. 12345';
  const item = query.get('item') || 'Service Item';
  const qty = query.get('qty') || '1';
  const price = query.get('price') || '$0.00';
  const total = query.get('total') || '$0.00';
  const clientPhone = query.get('clientPhone') || '';
  const companyEmail = query.get('companyEmail') || 'company@email.com';
  const companyPhone = query.get('companyPhone') || '+1 (555) 123-4567';
  const companyAddress = query.get('companyAddress') || '123 Main St, City, Country';

  // Calculate 18% tax included in the total
  function parseCurrency(val: string | undefined) {
    if (typeof val !== 'string') return 0;
    return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
  }
  const totalValue = parseCurrency(total);
  const taxAmount = totalValue - totalValue / 1.18;

  // CloudTech Solutions company info (from CompanyProfile)
  const companyProfile = {
    name: "CloudTech Solutions",
    logo: "https://logo.clearbit.com/cloudtech.com",
    industry: "Cloud Services",
    location: "Seattle, WA",
    email: "contact@cloudtech.com",
    website: "www.cloudtech.com"
  };

  // Large round digital stamp with watermark text inside
  const stampContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '24px 0 0 0',
    position: 'relative',
    zIndex: 1,
    pointerEvents: 'none',
    userSelect: 'none',
  };

  const roundStampStyle: React.CSSProperties = {
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'rgba(34,197,94,0.10)',
    border: '8px solid #22c55e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px #22c55e22',
    position: 'relative',
    transform: 'rotate(-10deg)',
    overflow: 'hidden',
  };

  const paidTextStyle: React.CSSProperties = {
    color: '#22c55e',
    fontWeight: 900,
    fontSize: 64,
    letterSpacing: 8,
    textTransform: 'uppercase',
    marginBottom: 12,
    textShadow: '0 2px 8px #22c55e33',
    opacity: 0.85,
  };

  const watermarkInStampStyle: React.CSSProperties = {
    color: '#2563eb33',
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 1.2,
    textShadow: '0 1px 4px #2563eb22',
  };

  // Inject print styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const [hoveredButton, setHoveredButton] = useState('');

  // Button styles to match profile page buttons
  const actionButtonBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.32rem',
    padding: '0.38rem 1.1rem',
    borderRadius: '4px',
    fontSize: '0.92rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    width: 'auto',
    minWidth: 0,
  };

  const bookButtonStyle = {
    ...actionButtonBase,
    backgroundColor: '#0066cc',
    color: 'white',
  };

  const bookButtonHover = {
    backgroundColor: '#0052a3',
  };

  const messageButtonStyle = {
    ...actionButtonBase,
    backgroundColor: 'white',
    color: '#0066cc',
    border: '2px solid #0066cc',
  };

  const messageButtonHover = {
    backgroundColor: '#f0f7ff',
  };

  return (
    <div className="invoice-print-area" style={{ fontFamily: 'Inter, sans-serif', background: '#fff', minHeight: '100vh', marginTop: 100, marginLeft: 120, marginRight: 120, padding: 32, position: 'relative', overflow: 'hidden' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginBottom: 24, width: '100%' }}>
        <button
          style={{ ...bookButtonStyle, ...(hoveredButton === 'print' ? bookButtonHover : {}) }}
          onMouseEnter={() => setHoveredButton('print')}
          onMouseLeave={() => setHoveredButton('')}
          onClick={() => window.print()}
        >
          <span style={{ fontSize: 24 }}></span> Print
        </button>
        <button
          style={{ ...messageButtonStyle, ...(hoveredButton === 'email' ? messageButtonHover : {}) }}
          onMouseEnter={() => setHoveredButton('email')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span style={{ fontSize: 24 }}></span> Email
        </button>
        <button
          style={{ ...bookButtonStyle, ...(hoveredButton === 'whatsapp' ? bookButtonHover : {}) }}
          onMouseEnter={() => setHoveredButton('whatsapp')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span style={{ fontSize: 24 }}></span> WhatsApp
        </button>
        <button
          style={{ ...messageButtonStyle, ...(hoveredButton === 'message' ? messageButtonHover : {}) }}
          onMouseEnter={() => setHoveredButton('message')}
          onMouseLeave={() => setHoveredButton('')}
        >
          <span style={{ fontSize: 24 }}></span> Message
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
        <div style={{ display: 'flex', gap: 48 }}>
          {/* Company Info */}
          <div style={{ minWidth: 220, maxWidth: 260, background: '#f8fafc', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px #e5eaf1' }}>
            <img src={companyProfile.logo} alt="CloudTech Solutions Logo" style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 4 }}>{companyProfile.name}</div>
            <div style={{ color: '#2563eb', fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{companyProfile.industry}</div>
            <div style={{ color: '#64748b', fontSize: 15, marginBottom: 2 }}>{companyProfile.location}</div>
            <div style={{ color: '#64748b', fontSize: 15, marginBottom: 2 }}>Email: <a href={`mailto:${companyProfile.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{companyProfile.email}</a></div>
            <div style={{ color: '#64748b', fontSize: 15 }}>Website: <a href={`https://${companyProfile.website}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{companyProfile.website}</a></div>
          </div>
          {/* Invoice Details */}
          <div>
            <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0, marginBottom: 32 }}>Consulting Invoice</h1>
            <div style={{ display: 'flex', gap: 64 }}>
              <div style={{ minWidth: 180 }}>
                <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>INVOICE NUMBER</div>
                <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 18 }}>{invoiceNumber}</div>
                <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>ISSUED ON</div>
                <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 18 }}>{issuedOn}</div>
                <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>PAYMENT DATE</div>
                <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 18 }}>{paymentDate}</div>
                <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>REFERENCE</div>
                <div style={{ fontWeight: 500, fontSize: 18 }}>{reference}</div>
              </div>
              <div style={{ minWidth: 220 }}>
                <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14 }}>BILL TO</div>
                <div style={{ fontWeight: 500, fontSize: 18 }}>{clientName}</div>
                <div style={{ fontWeight: 400, fontSize: 16 }}>{project}</div>
                {clientEmail && <div style={{ color: '#94a3b8', fontWeight: 400, fontSize: 16 }}>{clientEmail}</div>}
                {clientPhone && <div style={{ color: '#94a3b8', fontWeight: 400, fontSize: 16 }}>{clientPhone}</div>}
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: 80, height: 80, background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="YourPro Logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Consulting</div>
        <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>ITEMS</div>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ flex: 2, fontWeight: 500, fontSize: 16 }}>{item}</div>
          <div style={{ flex: 1, textAlign: 'center', color: '#222' }}>{qty}</div>
          <div style={{ flex: 1, textAlign: 'center', color: '#222' }}>{price}</div>
          <div style={{ flex: 1, textAlign: 'right', color: '#222', fontWeight: 600 }}>{total}</div>
        </div>
        {/* Tax info */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ color: '#64748b', fontWeight: 400, fontSize: 15 }}>
            Included 18% Tax: <span style={{ fontWeight: 600 }}>${taxAmount.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ color: '#94a3b8', fontWeight: 400, fontSize: 13 }}>
            (All prices include 18% tax)
          </div>
        </div>
      </div>
      {/* Large round digital stamp under the invoice content */}
      <div style={stampContainerStyle} aria-hidden="true">
        <div style={roundStampStyle}>
          <div style={paidTextStyle}>PAID</div>
          <div style={watermarkInStampStyle}>with YourPro</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsInvoice; 