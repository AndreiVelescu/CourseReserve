"use client";

import { Component, ErrorInfo } from "react";

import { Error404Page } from "../Error404Page/Error404Page";

import { Props, State } from "./types";

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo });
  }
  render() {
    const { customErrorChildren } = this.props;

    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return customErrorChildren !== undefined ? (
        customErrorChildren
      ) : (
        <Error404Page />
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
