import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Profile() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:4000/users/details", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(result => result.json())
        .then(data => {
            if (data.code === "USER-FOUND") {
                setUserProfile(data.result); 
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error"
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: "Error",
                text: "Something went wrong. Please try again later.",
                icon: "error"
            });
        });
    }, []);

    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: "Passwords don't match!",
                text: "Please make sure both password fields match.",
                icon: "error"
            });
            return;
        }

        const token = localStorage.getItem("token");

        fetch("http://localhost:4000/users/update-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
        })
        .then(result => result.json())
        .then(data => {
            if (data.code === "PASSWORD-UPDATE-SUCCESS") {
                Swal.fire({
                    title: "Password Updated",
                    text: data.message,
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error"
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: "Error",
                text: "Something went wrong. Please try again later.",
                icon: "error"
            });
        });
    };

    return (
        <Container className="mt-5">
            <h2>Profile Settings</h2>

            <Card className="mt-5">
                <Card.Body>
                    {userProfile ? (
                        <div>
                            <h3 className="mb-3">Your Information</h3>
                            <p><strong>Name:</strong> {userProfile.firstName} {userProfile.middleName} {userProfile.lastName}</p>
                            <p><strong>Email:</strong> {userProfile.email}</p>
                            <p><strong>Contact Number:</strong> {userProfile.contactNumber}</p>
                        </div>
                    ) : (
                        <p>Loading profile...</p>
                    )}
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Body>
                    <Form onSubmit={handlePasswordUpdate}>
                        <Form.Group className="mb-3">
                            <h3 className="mb-3">Change Password</h3>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">Update Password</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
