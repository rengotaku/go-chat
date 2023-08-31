import './reset.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { App } from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
// https://www.asobou.co.jp/blog/web/error-boundary
class ErrorBoundary extends React.Component<{}, { hasError: boolean }> { // eslint-disable-line @typescript-eslint/ban-types
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  static getDerivedStateFromError (_error: any) {
    return { hasError: true }
  }

  componentDidMount () {
    window.addEventListener('unhandledrejection', this.onUnhandledRejection)
  }

  componentWillUnmount () {
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection)
  }

  onUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.promise.catch((error) => {
      this.setState(ErrorBoundary.getDerivedStateFromError(error))
    })
  }

  componentDidCatch (error: any, errorInfo: any) {
    console.log('Unexpected error occurred!', error, errorInfo)
  }

  render () {
    if (this.state.hasError) {
      return <p>Something went wrong</p>
    }

    return this.props.children
  }
  /* eslint-enable @typescript-eslint/explicit-function-return-type */
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // rendering twice, but this do not effect in production
  // see@https://stackoverflow.com/a/65167384
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <RecoilRoot>
            <React.Suspense fallback={<div>Loading...</div>}>
              <App />
            </React.Suspense>
          </RecoilRoot>
        </ChakraProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
