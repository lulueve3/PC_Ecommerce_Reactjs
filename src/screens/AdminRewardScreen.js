import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import RewardModal from '../components/RewardModal'

const AdminRewardScreen = () => {
    const [rewards, setRewards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentReward, setCurrentReward] = useState(null); // null for new rewards

    useEffect(() => {
        fetchRewards();
    }, []);

    // Inside AdminRewardScreen component
    const onSave = async (rewardData) => {
        const accessToken = localStorage.getItem('accessToken');
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        try {
            if (currentReward) {
                // If editing, send a PATCH request
                await axios.patch(`http://localhost:8080/api/admin/forums/${currentReward.id}`, rewardData, config);
            } else {
                // If creating a new reward, send a POST request
                await axios.post('http://localhost:8080/api/admin/forums', rewardData, config);
            }
            toast.success('Reward saved successfully!');
            setShowModal(false);
            fetchRewards(); // Refresh the list
        } catch (error) {
            toast.error('Error saving reward: ' + error.message);
        }
    };

    const fetchRewards = async () => {
        const accessToken = localStorage.getItem('accessToken') || null;
        try {
            const response = await axios.get('http://localhost:8080/api/admin/forums', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    page: 0,
                    size: 10,
                    sortBy: 'id',
                    sortDirection: 'ASC'
                }
            });
            setRewards(response.data);
        } catch (error) {
            toast.error('Failed to fetch rewards');
        }
    };

    // Handler functions for POST, DELETE, PATCH, and opening the modal would go here...

    return (
        <div>
            <Button onClick={() => setShowModal(true)}>Create Reward</Button>
            <RewardModal
                show={showModal}
                onHide={() => setShowModal(false)}
                currentReward={currentReward}
                onSave={onSave}
            />
            <ToastContainer />
            {/* Render the table or list of rewards here */}
        </div>
    );
};



export default AdminRewardScreen;