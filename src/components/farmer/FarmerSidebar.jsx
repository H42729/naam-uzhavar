/**
 * FarmerSidebar Component (Backwards Compatibility Wrapper)
 * Re-exports FarmerTopNav as the modern two-tier horizontal navigation header.
 */

import React from 'react';
import FarmerTopNav from './FarmerTopNav';

export default function FarmerSidebar(props) {
  return <FarmerTopNav {...props} />;
}
