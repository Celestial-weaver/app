import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CardsProps {
  open: boolean;
  onClose: () => void;
  photographer: {
    id?: string;
    name: string;
    image: string;
    price: string;
    location: string;
    specialty: string;
    experience: string;
    rating: string;
    raw?: any;
  } | null;
}

export const Cards: React.FC<CardsProps> = ({ open, onClose, photographer }) => {
  if (!photographer) return null;
  const partner = photographer.raw || {};
  const portfolio = Array.isArray(partner.portfolio) ? partner.portfolio : [];
  const specializations = Array.isArray(partner.specializations) ? partner.specializations.join(', ') : '';
  const services = Array.isArray(partner.services) ? partner.services.join(', ') : '';
  const paymentMethods = partner.payment_methods ? Object.keys(partner.payment_methods).join(', ') : '';
  const socialLinks = partner.social_links ? Object.entries(partner.social_links).map(([k, v]) => `${k}: ${v}`).join(' | ') : '';
  const locations = Array.isArray(partner.serving_locations) ? partner.serving_locations.join(', ') : '';

  const servicesList = Array.isArray(partner.services)
    ? partner.services.map((s: any, i: number) => (
        <div key={i} className="mb-2">
          <div className="font-semibold">{s.name}</div>
          <div className="text-sm text-gray-600">{s.description}</div>
          <div className="text-sm">Price: ₹{s.base_price} {s.price_unit && <span>({s.price_unit.replace('_', ' ')})</span>}</div>
        </div>
      ))
    : null;
  const paymentMethodsArr = partner.payment_methods?.methods || [];
  const preferredPayment = partner.payment_methods?.preferred;
  const socialLinksArr = partner.social_links
    ? Object.entries(partner.social_links).filter(([_, v]) => v).map(([k, v]) => (
        <a key={k} href={v as string} target="_blank" rel="noopener noreferrer" className="mr-2 underline text-blue-600">{k}</a>
      ))
    : null;
  const partnerLocations = Array.isArray(partner.partner_locations)
    ? partner.partner_locations.map((loc: any, i: number) => (
        <div key={i} className="mb-1 text-sm">
          <span className="font-semibold">{loc.city}, {loc.state}</span>
          {Array.isArray(loc.pin_codes_served) && loc.pin_codes_served.length > 0 && (
            <span> (Pin codes: {loc.pin_codes_served.join(', ')})</span>
          )}
        </div>
      ))
    : null;
  const projectStats = partner.project_stats || {};
  const dashboardData = partner.dashboard_data || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogTitle>{photographer.name}</DialogTitle>
        <div className="flex gap-6 mt-4">
          <img
            src={photographer.image}
            alt={photographer.name}
            className="w-40 h-52 object-cover rounded-xl border"
          />
          <div className="flex-1">
            <div className="mb-2 font-semibold">Name: {partner.user_name || partner.username || photographer.name}</div>
            {partner.partner_type !== 'solo' && partner.company_name && (
              <div className="mb-2">Company: {partner.company_name}</div>
            )}
            <div className="mb-2 text-lg font-semibold">{Array.isArray(partner.specializations) ? partner.specializations.join(', ') : photographer.specialty} in {Array.isArray(partner.serving_locations) ? partner.serving_locations.join(', ') : photographer.location}</div>
            <div className="mb-2">Experience: {photographer.experience}</div>
            <div className="mb-2">Rating: {photographer.rating}</div>
            <div className="mb-2">Price per session: ₹{photographer.price}</div>
            {locations && <div className="mb-2">Serving Locations: {locations}</div>}
            {specializations && <div className="mb-2">Specializations: {specializations}</div>}
            {servicesList && <div className="mb-2">Services: {servicesList}</div>}
            {paymentMethodsArr.length > 0 && (
              <div className="mb-2">Payment Methods: {paymentMethodsArr.map((m: string, i: number) => (
                <span key={i} className={preferredPayment === m ? 'font-bold underline' : ''}>{m}{i < paymentMethodsArr.length - 1 ? ', ' : ''}</span>
              ))}</div>
            )}
            {partner.partner_type && <div className="mb-2">Partner Type: {partner.partner_type}</div>}
            {partner.verified !== undefined && <div className="mb-2">Verified: {partner.verified ? 'Yes' : 'No'}</div>}
            {socialLinksArr && <div className="mb-2">Social: {socialLinksArr}</div>}
            {partnerLocations && <div className="mb-2">Partner Locations: {partnerLocations}</div>}
            {(projectStats.total || projectStats.completed || projectStats.ongoing) && (
              <div className="mb-2">Project Stats: Total: {projectStats.total || 0}, Completed: {projectStats.completed || 0}, Ongoing: {projectStats.ongoing || 0}</div>
            )}
            {(dashboardData.views || dashboardData.leads || dashboardData.conversion_rate || dashboardData.revenue || (dashboardData.top_services && dashboardData.top_services.length)) && (
              <div className="mb-2">Dashboard: Views: {dashboardData.views || 0}, Leads: {dashboardData.leads || 0}, Conversion Rate: {dashboardData.conversion_rate || 0}, Revenue: ₹{dashboardData.revenue || 0}, Top Services: {dashboardData.top_services ? dashboardData.top_services.join(', ') : ''}</div>
            )}
          </div>
        </div>
        <Tabs defaultValue="inquiry" className="mt-6">
          <TabsList>
            <TabsTrigger value="inquiry">Inquiry</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          <TabsContent value="inquiry">
            <div>Inquiry form or contact options go here.</div>
          </TabsContent>
          <TabsContent value="reviews">
            <div>Reviews and ratings will be shown here.</div>
          </TabsContent>
          <TabsContent value="portfolio">
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolio.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ))}
              </div>
            ) : (
              <div>No portfolio images available.</div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
