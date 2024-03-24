// TaskPage.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';

const TaskPage = () => {
    return (
        <>
            <NavigationBar />
            <Container>
                <h2>Tasks</h2>
                <Card>
                    <Card.Body>
                        <Card.Title>Task 1</Card.Title>
                        <Card.Text>
                            Description of Task 1
                        </Card.Text>
                        <Button variant="primary">Complete Task</Button>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title>Task 2</Card.Title>
                        <Card.Text>
                            Description of Task 2
                        </Card.Text>
                        <Button variant="primary">Complete Task</Button>
                    </Card.Body>
                </Card>
                {/* Add more task cards as needed */}
            </Container>
        </>
    );
};

export default TaskPage;
