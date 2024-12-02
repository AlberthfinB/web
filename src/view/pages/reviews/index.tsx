"use client"

import ReviewList from "./reviewList";

export default function ReviewsMaster() {
    return (
        <div className="container mx-auto p-6">
            <div className="relative overflow-x-auto">
                <ReviewList />
            </div>
        </div>
    );
}
