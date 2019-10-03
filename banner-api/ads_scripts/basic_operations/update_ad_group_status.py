#!/usr/bin/env python
#
# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This example updates the CPC bid and status for a given ad group.

To get ad groups, run get_ad_groups.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords


AD_GROUP_ID = 'INSERT_AD_GROUP_ID_HERE'



def  UpdateAdGroupStatus(client, ad_group_id, last_status):
  # Initialize appropriate service.
  status = "PAUSED"
  if last_status == status:
    status = "ENABLED"
  else:
    status = status

  ad_group_service = client.GetService('AdGroupService', version='v201809')

  # Construct operations and update an ad group.
  operations = {
      'operator': 'SET',
      'operand': {
          'id': ad_group_id,
          'status': status
      }
  }

  ad_groups = ad_group_service.mutate(operations)

  # Display results.
  response = []
  for ad_group in ad_groups['value']:
    response.append({
      "status": "ok",
      "adgroup_status": ad_group['status']
    })

    print ('Ad group with name "%s", and id "%s" was updated to have status '
           '"%s".'
           % (ad_group['name'], ad_group['id'], ad_group['status']))
  return response

