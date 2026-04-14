import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.company || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Here you would integrate with:
    // - SendGrid for emails
    // - HubSpot/Salesforce CRM
    // - Airtable/Google Sheets
    console.log('Demo request received:', data)

    // Simulate successful processing
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
