import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Tabs, Tab, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { signup, login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (password !== confirmPassword) {
          throw new Error('Lösenorden matchar inte')
        }
        await signup(email, password)
      }
  
      // After successful auth, go to the protected root route
      navigate('/', { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ett fel uppstod')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      await googleLogin()
      navigate('/', { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ett fel uppstod vid Google-inloggning')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3 text-center">
                {mode === 'login' ? 'Logga in' : 'Registrera'}
              </Card.Title>

              <Tabs
                activeKey={mode}
                onSelect={(k) => k && setMode(k as 'login' | 'signup')}
                className="mb-3"
              >
                <Tab eventKey="login" title="Logga in" />
                <Tab eventKey="signup" title="Registrera" />
              </Tabs>

              {error && (
                <Alert variant="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>E-post</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lösenord</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </Form.Group>

                {mode === 'signup' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Bekräfta lösenord</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </Form.Group>
                )}

                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : mode === 'login' ? 'Logga in' : 'Registrera'}
                </Button>
              </Form>
              <Button
                type="button"
                variant="outline-primary"
                className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <i className="bi bi-google" />
                <span>{mode === 'login' ? 'Logga in med Google' : 'Registrera med Google'}</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Container>
  )
}