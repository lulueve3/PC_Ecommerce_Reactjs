import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <h1>Welcome to shop</h1>
        </Container>
      </main>

      <Footer />
    </>
  );
}

export default App;
