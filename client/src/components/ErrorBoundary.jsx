// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    // Update state to indicate that an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch and store error and error info in state
    this.setState({ error, errorInfo });
    console.error("Error caught:", error);
    console.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            <summary>Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {/* Check if errorInfo is available */}
            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack trace available'}
          </details>
        </div>
      );
    }

    return this.props.children; // If no error, render children
  }
}

export default ErrorBoundary;
