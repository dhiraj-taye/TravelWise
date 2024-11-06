import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Typography, List, Card, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const Trip = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handlePlanTrip = async () => {
    try {
      setLoading(true);
      const response = await axios.post( backendUrl + "/api/trip/plan", {
        country,
        city,
        days,
      });
      setTripPlan(response.data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#1F1B24",
        color: "#E0E0E0",
        borderRadius: "15px",
        boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          paddingBottom: "10px",
        }}
      >
        <img
          style={{
            height: "50px",
            filter: "drop-shadow(0px 0px 8px cyan)",
          }}
          src="./logoTW.png"
          alt="Logo"
        />
        <Title
          level={2}
          style={{
            margin: 0,
            color: "cyan",
            fontFamily: "Futura, sans-serif",
            textShadow: "0px 0px 10px cyan",
          }}
        >
          Travel Wise
        </Title>
      </div>
      <Input
        placeholder="Enter country name"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid cyan",
        }}
      />
      <Input
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid cyan",
        }}
      />
      <Input
        type="number"
        placeholder="Enter number of days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        style={{
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid cyan",
        }}
      />
      <Button
        type="primary"
        onClick={handlePlanTrip}
        loading={loading}
        style={{
          width: "100%",
          background: "linear-gradient(45deg, cyan, #6A5ACD)",
          border: "none",
          borderRadius: "8px",
          marginTop: "10px",
          boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.6)",
        }}
      >
        {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />} /> : "Plan Trip"}
      </Button>
      {error && (
        <Text
          type="danger"
          style={{
            marginTop: "10px",
            display: "block",
            color: "#FF4D4F",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {error}
        </Text>
      )}
      {tripPlan && (
        <div style={{ marginTop: "20px", fontFamily: "Roboto, sans-serif" }}>
          <Text strong style={{ color: "cyan" }}>Generated Trip Plan:</Text>
          <p style={{ fontSize: "16px", color: "#B3B3B3" }}>{tripPlan.plan}</p>
          <Text strong style={{ color: "cyan" }}>Top Places to Visit:</Text>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={tripPlan.touristPlaces}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    item.image ? (
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{
                          height: 150,
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.2)",
                        }}
                      />
                    ) : null
                  }
                  style={{
                    backgroundColor: "#2C2C34",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Meta title={<span style={{ color: "#fff" }}>{item.name}</span>} />
                </Card>
              </List.Item>
            )}
          />
          <Text strong style={{ color: "cyan" }}>Top Restaurants:</Text>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={tripPlan.restaurants}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    item.image ? (
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{
                          height: 150,
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.2)",
                        }}
                      />
                    ) : null
                  }
                  style={{
                    backgroundColor: "#2C2C34",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Meta title={<span style={{ color: "#fff" }}>{item.name}</span>} />
                </Card>
              </List.Item>
            )}
          />
          <Text strong style={{ color: "cyan" }}>Top Hotels:</Text>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={tripPlan.hotels}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    item.image ? (
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{
                          height: 150,
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.2)",
                        }}
                      />
                    ) : null
                  }
                  style={{
                    backgroundColor: "#2C2C34",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Meta title={<span style={{ color: "#fff" }}>{item.name}</span>} />
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Trip;
