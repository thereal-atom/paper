import React, { useEffect, useState, useRef } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from 'react-router-dom';

import './Update.css';

const Update = () => {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updatePassword, updateEmail } = useAuth();
    const [error, setError] = useState('');
    const[loading, setLoading] = useState(false);
    const history = useHistory();

    function handleSubmit(e) {
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
    
        const promises = []
        setLoading(true)
        setError("")
    
        if (emailRef.current.value !== currentUser.email) {
          promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
          promises.push(updatePassword(passwordRef.current.value))
        }
    
        Promise.all(promises)
        .then(() => {
            history.push("/account")
        })
        .catch(() => {
            if(!passwordRef.current.value.length < 6) setError("Password is too short") 
            else{
                setError("Failed to update account")
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return(
        <div className="update-container">
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultvalue={currentUser.email}/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Leave password to keep the same"/>
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave password to keep the same"/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2"><Link to="/account">Cancel.</Link></div>
        </div>
    )
}

export default Update;
