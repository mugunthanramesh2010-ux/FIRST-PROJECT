import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL UI RUNTIME ERROR CAUGHT BY ERROR BOUNDARY:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    localStorage.removeItem('viva_session_user_v1');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#FFF8E8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
          color: '#2D3748'
        }}>
          <div style={{
            maxWidth: '680px',
            width: '100%',
            backgroundColor: '#FFFCF4',
            border: '2px solid #E2D3A7',
            borderRadius: '18px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(183,121,31,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#FFF0F0',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C53030',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                ⚠
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#2D3748' }}>
                  System Recovery Interface
                </h2>
                <p style={{ fontSize: '13px', color: '#718096', margin: '2px 0 0 0' }}>
                  VIVA ANALYSER caught a runtime rendering issue.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFDF8',
              border: '1px solid #E2D3A7',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#C53030',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#B7791F',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reset Session & Reload Portal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
