// I:\FromGit\Wall-Damage-Analysis-and-Cost-Estimation-project\src\app\components\footer.js
import React from "react";

export default function Footer() {
  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()}{" "}
          Wall-Damage-Analysis-and-Cost-Estimation.com. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
