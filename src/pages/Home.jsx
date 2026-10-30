import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function Home() {
  return (
    <div>
      <Title level={2}> Welcome in the React Playground</Title>
      <Paragraph type="secondary" style={{ fontSize: 16 }}>
        This is my personal website to showcase some unique features that i can think of with React
        JS.
      </Paragraph>
    </div>
  )
}
