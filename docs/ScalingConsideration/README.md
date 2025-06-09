# Scaling Considerations

## How would you scale this to 10K concurrent users?

- Kubernetes + Load Balancer

  - Automatically manages your app’s containers and distributes incoming traffic evenly
    - Automatically adds more app instances (pods) when traffic increases — uto-scaling.
    - Ensures your service is always online and available.
    - Use A load balancer (e.g., Nginx or Kubernetes Ingress) spreads the load across multiple instances to avoid overloading any one of them.
  - Helps your app scale to thousands of users with minimal downtime.

- Redis Adapter

  - Syncs events between multiple WebSocket servers.
    - In real-time apps like chat, users connect to different servers.
    - Redis ensures that a message sent from one server reaches users on all servers.
  - Enables real-time messaging across multiple backend instances.

- Indexing (DB)

  - Speeds up queries by making data easier to find.
    - Makes reading data (e.g., fetching messages or user info) much faster, especially as the database grows.
    - Reduces the load on your database during high traffic
    - Note: Indexes slightly slow down write operations (like inserting a message), but it’s a worthy trade-off for better read performance.
  - Critical for scaling read-heavy workloads like chat history retrieval.

- Pagination (db)

  - Prevents overloading the server and client by limiting the number of records returned in a single request (e.g., messages, users).
  - Essential for efficient UI rendering and API performance, especially as datasets grow.
  - Reduces memory and bandwidth usage on both server and client sides.

- RabbitMQ

  - Handles background jobs separately from the main app.
    - Tasks like sending emails, processing uploads, or logging analytics don’t block the user experience.
    - Frees up your app to stay fast and responsive while background tasks happen asynchronously.
  - Reduce latency (TTL)
    - Instead of doing everything in one go (e.g., sending a message and saving logs and notifying other users), the backend:
      - Responds immediately to the client (with just the message they expect).
      - Sends other tasks to RabbitMQ to be processed in the background.
  - Makes your system more scalable, reliable, and responsive.

- Offloading with Cron Jobs (Server Resource Optimization)
  - To reduce load on the core application server, non-immediate tasks can be scheduled to run in the background using cron jobs or dedicated job schedulers.
    - Frees up real-time processing capacity for handling chat and user interactions.
    - Improves system stability by spreading load over time.
    - Enables better CPU and memory utilization through scheduled execution.
  - Use a cron job inside a Docker container scheduled via Kubernetes (e.g., using CronJob resource).
- Microservices

  - Breaking the system into microservices (e.g., Auth, Chat, Notifications, User Profile) allows independent development, deployment, and scaling of components based on their specific load and responsibilities.
    - Scale high-traffic services (like real-time messaging or authentication) independently.
    - Technology flexibility
      - Use Go for CPU-intensive or concurrent workloads due to its lightweight goroutines and native concurrency model.
      - Use Node.js for IO-bound tasks like WebSocket handling and quick prototyping.

- Protocol Buffers (Protobuf)

  - Protobuf encodes data in a compact binary format, significantly reducing message size compared to JSON REST payloads.
    - It lowers network bandwidth usage,
    - allowing more requests to be handled concurrently without saturating the network.
  - Faster Serialization/Deserialization
    - Protobuf is much faster to serialize and deserialize than JSON
    - Decreases CPU overhead on servers and clients, enabling your system to process more requests in less time and scale efficiently under high load.

- Socket.IO Optimization for Scalability
  - Avoid Global Broadcasts
    - Instead of broadcasting events (e.g., user_online) to all connected clients, target only relevant users—such as friends or chat members who actually need that information.

## What bottlenecks do you anticipate?

- Monolithic Architecture?
  - Bottleneck
    - Spike in traffic to one component (e.g., chat) can overwhelm the entire system.
- REST API Only
  - Bottleneck
    - Higher network and CPU load from serializing/deserializing large JSON payloads.
- Socket.IO Broadcasting Globally
  - Bottleneck
    - Wastes bandwidth and CPU cycles, especially with 1,000s of users.
- No Message Queue (RabbitMq)
  - Bottleneck
    - Slows down API responses, increases user-perceived latency.
- No Load Testing (e.g., k6)
  - Bottleneck
    - Unknown thresholds and undetected failure points.
- No Auto-Scaling or Load Balancer
  - Bottlneck
    - Cannot handle increasing traffic dynamically.
