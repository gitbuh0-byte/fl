import { Lead } from '../types';

/**
 * Clean and escape string values for CSV format
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let strVal = typeof value === 'object' ? JSON.stringify(value) : String(value);

  // Replace internal quotes with double quotes
  strVal = strVal.replace(/"/g, '""');

  // Wrap inside double quotes
  return `"${strVal}"`;
}

/**
 * Convert an array of Leads into standard CSV formatted string
 */
export function convertLeadsToCSVString(leads: Lead[]): string {
  const headers = [
    'Lead ID',
    'Company / Business Name',
    'Contact Person',
    'Job Title',
    'Email Address',
    'Phone Number',
    'Website',
    'Address',
    'Rating (Stars)',
    'Reviews Count',
    'Source Channel',
    'Campaign / Keyword Source',
    'Pipeline Stage',
    'Estimated Deal Value ($)',
    'Lead Score',
    'Intent Level',
    'Tags',
    'Assigned Rep',
    'Notes',
    'LinkedIn',
    'Instagram',
    'Twitter',
    'Facebook',
    'AI Pitch Angle',
    'AI Executive Summary',
    'Created Date',
    'Last Contacted Date',
  ];

  const rows = leads.map((lead) => {
    const stageLabel = lead.pipelineStage ? lead.pipelineStage.replace('_', ' ').toUpperCase() : 'NEW';
    const channelLabel = lead.sourceChannel ? lead.sourceChannel.replace('_', ' ').toUpperCase() : 'DIRECT';
    const campaignOrKeyword = lead.sourceDetails?.campaignName || lead.sourceDetails?.searchKeyword || lead.sourceDetails?.searchLocation || '';
    const tagsString = Array.isArray(lead.tags) ? lead.tags.join(', ') : '';
    
    return [
      escapeCSVValue(lead.id),
      escapeCSVValue(lead.name),
      escapeCSVValue(lead.contactPerson || ''),
      escapeCSVValue(lead.title || ''),
      escapeCSVValue(lead.email || ''),
      escapeCSVValue(lead.phone || ''),
      escapeCSVValue(lead.website || ''),
      escapeCSVValue(lead.address || ''),
      escapeCSVValue(lead.rating !== undefined ? lead.rating : ''),
      escapeCSVValue(lead.reviewsCount !== undefined ? lead.reviewsCount : ''),
      escapeCSVValue(channelLabel),
      escapeCSVValue(campaignOrKeyword),
      escapeCSVValue(stageLabel),
      escapeCSVValue(lead.dealValue || 0),
      escapeCSVValue(lead.leadScore || 0),
      escapeCSVValue(lead.intentLevel || 'Medium'),
      escapeCSVValue(tagsString),
      escapeCSVValue(lead.assignedTo || 'Unassigned'),
      escapeCSVValue(lead.notes || ''),
      escapeCSVValue(lead.socialHandles?.linkedin || ''),
      escapeCSVValue(lead.socialHandles?.instagram || ''),
      escapeCSVValue(lead.socialHandles?.twitter || ''),
      escapeCSVValue(lead.socialHandles?.facebook || ''),
      escapeCSVValue(lead.aiInsights?.recommendedPitch || ''),
      escapeCSVValue(lead.aiInsights?.summary || ''),
      escapeCSVValue(lead.createdAt || ''),
      escapeCSVValue(lead.lastContactedAt || ''),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generate and trigger download of a CSV file in browser
 */
export function downloadLeadsCSV(leads: Lead[], customFilename?: string): { success: boolean; filename: string; count: number } {
  if (!leads || leads.length === 0) {
    return { success: false, filename: '', count: 0 };
  }

  const csvContent = convertLeadsToCSVString(leads);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const today = new Date().toISOString().split('T')[0];
  const filename = customFilename || `omnibiz_export_${today}_${leads.length}_leads.csv`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    success: true,
    filename,
    count: leads.length,
  };
}
