window.portfolioProjects = [
    {
        "id": "01",
        "title": "Retail Kiosk Engine",
        "description": "I built the core engine that powers high-volume self-service kiosks, ensuring hardware integration is fast and failure-proof.",
        "overview": "Developing a next-generation Point-of-Sale ecosystem for global retail brands. I focused on the parts users don't see—the hardware bridges and the low-latency sync that keeps queues moving.",
        "role": "I led the Flutter development for the kiosk shell, focusing on making hardware peripherals feel like a natural extension of the software.",
        "challenge": "Making receipt printers and scanners play nice with a 120Hz UI is notoriously tricky. I had to build custom bridges to handle hardware lags without stuttering the display.",
        "impact": "The system is now live across major retail points, providing a stable foundation for thousands of daily transactions.",
        "tech": ["Flutter", "Dart", "AFS Gateway", "Native Bridge"],
        "heroImage": "assets/projects/01/hero.png",
        "secondaryImages": ["assets/projects/01/internal.png"]
    },
    {
        "id": "02",
        "title": "Health Telemetry Sync",
        "description": "A deep dive into medical data. I optimized how biometric devices sync with medical dashboards to provide real-time patient insights.",
        "overview": "A specialized monitoring system that aggregates data from wearables. I focused on the data pipeline—making sure every heartbeat is recorded and visualized instantly.",
        "role": "I was responsible for the data visualization layers and the 'brain' that decides how and when to sync data to save battery.",
        "challenge": "The math was easy, but the performance was hard. I had to figure out how to process millions of data points on a mobile CPU without it heating up.",
        "impact": "Resulted in a more responsive monitoring experience and better data integrity for medical teams.",
        "tech": ["Flutter", "Firebase", "HealthKit", "WebSocket"],
        "heroImage": "assets/projects/02/hero.png",
        "secondaryImages": ["assets/projects/02/internal.png"]
    },
    {
        "id": "03",
        "title": "Payment Abstraction",
        "description": "I designed a central 'vault' to handle multiple payment providers, making a complex checkout flow feel simple and secure.",
        "overview": "Enterprise platforms need to switch payment providers without rewriting their whole app. I built the layer that makes that possible while keeping everything PCI compliant.",
        "role": "I designed the architecture for provider-agnostic payments, focusing on data privacy and transaction security.",
        "challenge": "Every payment API thinks differently. I had to build a 'universal translator' for checkout flows that handle errors gracefully every time.",
        "impact": "Now standard practice for the platform's multi-provider checkout strategy.",
        "tech": ["Flutter", "Razorpay API", "Secure Storage"],
        "heroImage": "assets/projects/03/hero.png",
        "secondaryImages": ["assets/projects/03/internal.png"]
    },
    {
        "id": "04",
        "title": "Offline-First Inventory",
        "description": "Retail doesn't always have great Wi-Fi. I built an inventory system that stays in sync even when the store goes offline.",
        "overview": "Reliable stock management for retail chains. I built the sync protocols that allow store managers to work offline and merge their data perfectly when back online.",
        "role": "I designed the gRPC sync protocol and the local database schema from the ground up.",
        "challenge": "Merge conflicts in inventory are a nightmare. I built a custom resolution engine that ensures stock counts stay accurate across multiple locations.",
        "impact": "Successfully deployed across 50+ locations, solving long-standing stock discrepancy issues.",
        "tech": ["Flutter", "SQLite", "gRPC", "Riverpod"],
        "heroImage": "assets/projects/04/hero.png",
        "secondaryImages": ["assets/projects/04/internal.png"]
    },
    {
        "id": "05",
        "title": "Logistics Live Map",
        "description": "I built the real-time tracking interface for thousands of delivery vehicles, focusing on performance at scale.",
        "overview": "Managing a fleet requires seeing everything at once. I built the map engine and activity feed that makes tracking thousands of trucks feel snappy.",
        "role": "My focus was on the UI performance—making sure the map is always fluid even with massive data overlays.",
        "challenge": "Browsers struggle with thousands of points on a map. I had to lean hard on canvas optimizations and data clustering to keep it fast.",
        "impact": "Provides a reliable, real-time visual truth for logistics coordinators managing regional fleets.",
        "tech": ["Flutter Web", "Google Maps API", "Node.js", "Redis"],
        "heroImage": "assets/projects/05/hero.png",
        "secondaryImages": ["assets/projects/05/internal.png"]
    }
];
