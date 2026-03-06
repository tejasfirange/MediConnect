import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PrescriptionTemplate = ({ consultation }) => {
  if (!consultation) return null;

  const {
    id,
    patient_name,
    patient_dob,
    gender,
    doctor_name,
    registration_no,
    qualification,
    doctor_phone,
    created_at,
    doctor_prescription,
    report_data
  } = consultation;

  const date = new Date(created_at).toLocaleDateString();
  const rawAge = patient_dob ? Math.floor((new Date() - new Date(patient_dob)) / 31557600000) : null;
  const ageDisplay = rawAge ? `${rawAge} Years` : 'Age Not Specified';
  const sexDisplay = gender ? gender : 'Sex Not Specified';

  const patientDisplayName = patient_name || consultation.patient_email?.split('@')[0] || 'Patient';

  return (
    <div id={`prescription-pdf-${id}`} className="hidden-print-template">
      <div className="medical-prescription-container">
        {/* Minimalist Header */}
        <div className="prescription-header">
          <div className="hospital-branding">
            <h1 className="brand-name" style={{ color: '#000', fontSize: '28px' }}>MediConnect</h1>
            <p className="hospital-tag" style={{ color: '#666', fontSize: '10px' }}>SMART DIGITAL HEALTHCARE NETWORK</p>
          </div>
          <div className="doctor-info-header">
            <h2 className="doc-name" style={{ fontSize: '18px' }}>Dr. {doctor_name || 'Medical Officer'}</h2>
            <p className="doc-qual" style={{ fontSize: '12px' }}>{qualification || 'M.B.B.S, M.D.'}</p>
            <p className="doc-reg" style={{ fontSize: '11px', color: '#666' }}>REG ID: {registration_no || 'VALIDATED'}</p>
          </div>
        </div>

        <div style={{ borderBottom: '2px solid #000', margin: '15px 0' }}></div>

        {/* Essential Patient Info - Compact */}
        <div className="patient-detail-grid" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#666', marginRight: '5px' }}>PATIENT:</span>
            <span style={{ fontWeight: 800 }}>{patientDisplayName.toUpperCase()}</span>
          </div>
          <div>
            <span style={{ color: '#666', marginRight: '5px' }}>DATE:</span>
            <span>{date}</span>
          </div>
          <div>
            <span style={{ color: '#666', marginRight: '5px' }}>SEX:</span>
            <span>{sexDisplay}</span>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="rx-symbol" style={{ fontSize: '32px', marginBottom: '5px' }}>Rx</div>

        {/* Core Prescription Table & Note Only */}
        <div className="prescription-body">
           <div className="markdown-wrapper medical-rx-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {doctor_prescription}
              </ReactMarkdown>
           </div>
        </div>

        {/* Footer */}
        <div className="prescription-footer" style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <div className="footer-disclaimer">
            Substitute with equivalent Generics as required.
          </div>
          <div className="signature-area">
             <div className="sig-line"></div>
             <p className="sig-label">Digitally Signed by Dr. {doctor_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTemplate;
