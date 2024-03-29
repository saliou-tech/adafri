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

"""This example gets all ad groups for a given campaign.

To add an ad group, run add_ad_group.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from googleads import adwords


PAGE_SIZE = 500



def get_ad_group(client, name):
  INFOS = []
  # Initialize appropriate service.
  ad_group_service = client.GetService('AdGroupService', version='v201809')

  # Construct selector and get all ad groups.
  offset = 0
  selector = {
      'fields': ['Id', 'Name', 'Status'],
      'predicates': [
          {
              'field': 'Name',
              'operator': 'EQUALS',
              'values': name
          }
      ],
      'paging': {
          'startIndex': str(offset),
          'numberResults': str(PAGE_SIZE)
      }
  }
  more_pages = True
  while more_pages:
    page = ad_group_service.get(selector)

    # Display results.
    if 'entries' in page:
      for ad_group in page['entries']:
        INFOS.append({
          "id": ad_group['id'],
          "name": ad_group['name']
        })
        print ('Ad group with name "%s", id "%s" and status "%s" was '
               'found.' % (ad_group['name'], ad_group['id'],
                           ad_group['status']))
    else:
      INFOS = []
      print('No ad groups were found.')
      
    offset += PAGE_SIZE
    selector['paging']['startIndex'] = str(offset)
    more_pages = offset < int(page['totalNumEntries'])

    return INFOS



