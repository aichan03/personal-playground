import { useRouteError, isRouteErrorResponse, Link } from 'react-router'
import { Result, Button } from 'antd'

export default function ErrorPage() {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : 500
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error?.message || 'Something went wrong'

  return (
    <Result
      status={status === 404 ? '404' : 'error'}
      title={status}
      subTitle={message}
      extra={
        <Link to="/">
          <Button type="primary">Back home</Button>
        </Link>
      }
    />
  )
}
