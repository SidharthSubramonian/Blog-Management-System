
export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <h1 className="font-heading text-4xl font-bold">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <h2>1. Information We Collect</h2>
        <p>
          When you use Blog.com, we collect information that you provide directly to us,
          including when you:
        </p>
        <ul>
          <li>Create an account</li>
          <li>Create or publish blog posts</li>
          <li>Leave comments</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact us through our contact form</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process and complete transactions</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          described in this privacy policy.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We take reasonable measures to help protect your personal information
          from loss, theft, misuse, and unauthorized access.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          through our contact form.
        </p>
      </div>
    </div>
  );
}
