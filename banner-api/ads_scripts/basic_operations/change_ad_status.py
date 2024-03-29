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

"""This example updates status for a given ad.

To get ads, run get_text_ads.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords


AD_GROUP_ID = 'INSERT_AD_GROUP_ID_HERE'
AD_ID = 'INSERT_AD_ID_HERE'


def ChangeAdStatus(client, ad_group_id, ad_id, last_status):
  # Initialize appropriate service.
  response = []
  STATUS = ["PAUSED", "ENABLED"]
  STATUS.remove(last_status)
  ad_group_ad_service = client.GetService('AdGroupAdService', version='v201809')

  # Construct operations and update an ad.
  operations = [{
      'operator': 'SET',
      'operand': {
          'adGroupId': ad_group_id,
          'ad': {
              'id': ad_id,
          },
          'status': status
      }
  }for status in STATUS]
  ads = ad_group_ad_service.mutate(operations)

  # Display results.
  for ad in ads['value']:
    print(ad['ad'])
    response.append({
        "status": STATUS[0]
    })
    print ('Ad with id "%s" was updated.'% ad['ad']['id'])


  return response

