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


AD_GROUP_ID = '72362966135'

GENDER_MALE = '10'
AGE_RANGE_UNDETERMINED = '503999'

def main(client, ad_group_id):
  # Initialize appropriate service.
  ad_group_service = client.GetService('AdGroupCriterionService', version='v201809')

  # Construct operations and update an ad group.
  operations = [{
      'operator': 'ADD',
       'operand': {
              'xsi_type': 'BiddableAdGroupCriterion',
              'adGroupId': ad_group_id,
              'criterion': {
              'xsi_type': 'Gender',
              # Create gender criteria. The IDs can be found in the
              # documentation:
              # https://developers.google.com/adwords/api/docs/appendix/genders.
              'id': GENDER_MALE
              },
              'criterion': {

                  'xsi_type': 'Placement',
                  'url': 'www.comparez.co'

              },

          },

            
      }
   for i in range(2)]

 


  ad_groups = ad_group_service.mutate(operations)

  # Display results.
  for ad_group in ad_groups['value']:
    

   print(ad_group)


if __name__ == '__main__':
  # Initialize client object.
  adwords_client = adwords.AdWordsClient.LoadFromStorage('../../googleads.yaml')

  main(adwords_client, AD_GROUP_ID)
