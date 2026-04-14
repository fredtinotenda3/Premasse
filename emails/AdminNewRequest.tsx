// emails/AdminNewRequest.tsx
// Sent to the Premasse admin when a new service request is submitted.
// Includes all client details and a direct link to the request in the dashboard.

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

type Props = {
  clientName:   string;
  clientEmail:  string;
  clientPhone:  string | null;
  serviceName:  string;
  notes:        string;
  requestId:    string;
  submittedAt:  string;
  dashboardUrl: string;
};

export default function AdminNewRequest({
  clientName   = "Tatenda Moyo",
  clientEmail  = "tatenda@example.com",
  clientPhone  = "+263 77 123 4567",
  serviceName  = "Tax Clearance Certificate",
  notes        = "I need my ITF263 for a government tender closing end of month.",
  requestId    = "clx1234567890",
  submittedAt  = new Date().toLocaleString("en-ZW"),
  dashboardUrl = "http://localhost:3000/dashboard/requests/clx1234567890",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        New request: {serviceName} from {clientName}
      </Preview>

      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>Premasse</Text>
            <Text style={logoSub}>Admin notification</Text>
          </Section>

          {/* Alert banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>New service request received</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>
              {serviceName}
            </Heading>
            <Text style={body}>
              A new service request has been submitted and is awaiting your
              review. All details are below.
            </Text>

            {/* Client details */}
            <Text style={sectionLabel}>Client details</Text>
            <Section style={detailBox}>
              {[
                { k: "Name",    v: clientName },
                { k: "Email",   v: clientEmail },
                { k: "Phone",   v: clientPhone ?? "Not provided" },
                { k: "Service", v: serviceName },
                { k: "Submitted", v: submittedAt },
              ].map(({ k, v }, i, arr) => (
                <React.Fragment key={k}>
                  <Row style={detailRow}>
                    <Column style={detailKey}>{k}</Column>
                    <Column style={detailVal}>{v}</Column>
                  </Row>
                  {i < arr.length - 1 && <Hr style={thinDivider} />}
                </React.Fragment>
              ))}
            </Section>

            {/* Client notes */}
            <Text style={sectionLabel}>Client notes</Text>
            <Section style={notesBox}>
              <Text style={notesText}>{notes}</Text>
            </Section>

            {/* Reference */}
            <Text style={refLine}>
              Reference: <span style={refId}>{requestId}</span>
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={dashboardUrl} style={ctaButton}>
                Open in dashboard →
              </Button>
            </Section>

            <Text style={hint}>
              Log in to the admin dashboard to update the status, add internal
              notes, and view any uploaded documents.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              Premasse Business Services · Harare, Zimbabwe
            </Text>
            <Text style={footerText}>
              This is an automated notification. Do not reply to this email.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#FAFAF8",
  fontFamily: "'DM Sans', Georgia, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
};

const header: React.CSSProperties = {
  backgroundColor: "#0A2540",
  padding: "28px 40px",
};

const logoText: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
  letterSpacing: "0.02em",
};

const logoSub: React.CSSProperties = {
  color: "#C9A84C",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  margin: "2px 0 0",
};

const alertBanner: React.CSSProperties = {
  backgroundColor: "#C9A84C",
  padding: "10px 40px",
};

const alertText: React.CSSProperties = {
  color: "#0A2540",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: "0",
};

const content: React.CSSProperties = {
  padding: "36px 40px 28px",
};

const h1: React.CSSProperties = {
  color: "#0A2540",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 16px",
  fontFamily: "Georgia, serif",
};

const body: React.CSSProperties = {
  color: "#4A5568",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 24px",
};

const sectionLabel: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "10px",
  fontWeight: "600",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  margin: "0 0 8px",
};

const detailBox: React.CSSProperties = {
  border: "1px solid #E2E8F0",
  borderRadius: "2px",
  padding: "4px 20px",
  marginBottom: "24px",
};

const detailRow: React.CSSProperties = {
  padding: "8px 0",
};

const detailKey: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "12px",
  width: "100px",
  verticalAlign: "top",
};

const detailVal: React.CSSProperties = {
  color: "#0A2540",
  fontSize: "13px",
  fontWeight: "500",
};

const thinDivider: React.CSSProperties = {
  borderColor: "#F3F4F6",
  margin: "0",
};

const notesBox: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: "2px",
  padding: "14px 20px",
  marginBottom: "20px",
};

const notesText: React.CSSProperties = {
  color: "#4A5568",
  fontSize: "14px",
  lineHeight: "1.65",
  margin: "0",
  whiteSpace: "pre-wrap",
};

const refLine: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "12px",
  margin: "0 0 28px",
};

const refId: React.CSSProperties = {
  fontFamily: "monospace",
  color: "#0A2540",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  margin: "0 0 20px",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#0A2540",
  color: "#C9A84C",
  fontSize: "14px",
  fontWeight: "600",
  padding: "14px 32px",
  borderRadius: "2px",
  textDecoration: "none",
  letterSpacing: "0.04em",
  display: "inline-block",
};

const hint: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "12px",
  textAlign: "center",
  lineHeight: "1.6",
  margin: "0",
};

const footer: React.CSSProperties = {
  padding: "0 40px 32px",
};

const divider: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "0 0 20px",
};

const footerText: React.CSSProperties = {
  color: "#CBD5E0",
  fontSize: "11px",
  textAlign: "center",
  margin: "4px 0",
};
