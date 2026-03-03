import { Button, Container, Navbar } from 'react-bootstrap'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/">My App</Navbar.Brand>
        <Button variant="outline-light" onClick={() => handleLogout()}>Logga ut</Button>
      </Container>
    </Navbar>
  )
}