# coding=utf-8

import uuid
import requests
import googleads
import sys
import random
import time
from urllib.request import urlopen
import uuid
from googleads import adwords
from requests_html import HTMLSession
from googleads.errors import GoogleAdsServerFault
from googleads import errors

MAX_POLL_ATTEMPTS = 5
PENDING_STATUSES = ('ACTIVE', 'AWAITING_FILE', 'CANCELING')
PAGE_SIZE = 100


def UploadImageAsset(client, url):
  """Uploads the image from the specified url.
  Args:
    client: An AdWordsClient instance.
    url: The image URL.
  Returns:
    The ID of the uploaded image.
  """
  # Initialize appropriate service.
  asset_service = client.GetService('AssetService', version='v201809')

  # Download the image.
  headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }
  session__ = HTMLSession()
  print("URL: "+ url)
  image_request = session__.get(url, headers=headers, verify=True)
  print(image_request.html)

  # Create the image asset.
  image_asset = {
      'xsi_type': 'ImageAsset',
      'imageData': image_request.content,
      # This field is optional, and if provided should be unique.
      # 'assetName': 'Image asset ' + str(uuid.uuid4()),
  }

  # Create the operation.
  operation = {
      'operator': 'ADD',
      'operand': image_asset
  }

  # Create the asset and return the ID.
  result = asset_service.mutate([operation])

  return result['value'][0]['assetId']


def ads(client, number_of_campaigns, number_of_adgroups, number_of_keywords, url, description, titre, email):
  # Initialize BatchJobHelper.
  campagne = getCampaign(client, email)

  if campagne != None:
        ad_group_ad_service = client.GetService('AdGroupAdService', version='v201809')
        print("start")
        AgId = AdGroupId(client, campagne)
        print(AgId)





      # Create the ad.
        multi_asset_responsive_display_ad = {
          'xsi_type': 'MultiAssetResponsiveDisplayAd',
          'headlines': [{
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': titre + email
          }
         }],
        'descriptions': [{
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': description
          }

         }],
         'businessName': "Le comparateur",
         'longHeadline': {
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': 'Comparateur de titre.',
          }
        },
      # This ad format does not allow the creation of an image asset by setting
      # the asset.imageData field. An image asset must first be created using
      # the AssetService, and asset.assetId must be populated when creating
      # the ad.
         'marketingImages': [{
          'asset': {
              'xsi_type': 'ImageAsset',
              'assetId': UploadImageAsset(client, url)
          }
         }],
         'squareMarketingImages': [{
          'asset': {
              'xsi_type': 'ImageAsset',
              'assetId': UploadImageAsset(client, 'http://137.74.199.121/static/ads/3.jpg')
          }
         }],
      # Optional values
        'finalUrls': ['https://sn.comparez.co'],
        'callToActionText': 'Shop Now',
      # Set color settings using hexadecimal values. Set allowFlexibleColor to
      # false if you want your ads to render by always using your colors
      # strictly.
        'mainColor': '#0000ff',
        'accentColor': '#ffff00',
        'allowFlexibleColor': False,
        'formatSetting': 'NON_NATIVE',
      # Set dynamic display ad settings, composed of landscape logo image,
      # promotion text, and price prefix.
        'dynamicSettingsPricePrefix': 'as low as',
        'dynamicSettingsPromoText': 'Livraison gratuite!',
        'logoImages': [{
          'asset': {
              'xsi_type': 'ImageAsset',
              'assetId': UploadImageAsset(client, 'http://137.74.199.121/static/ads/2.jpg')
          }
      }]

        }

      # Create ad group ad.
        ad_group_ad = {
          'adGroupId': AgId,
          'ad': multi_asset_responsive_display_ad,
          # Optional.
          'status': 'PAUSED'
         }

      # Add ad.
        ads = ad_group_ad_service.mutate([
          {'operator': 'ADD', 'operand': ad_group_ad}
        ])
      # Display results.
        if 'value' in ads:
            for ad in ads['value']:
             print ('Added new responsive display ad ad with ID "%d" '
                'and long headline "%s".'
                % (ad['ad']['id'], ad['ad']['longHeadline']['asset']['assetText']))
        else:
             print ('No ads were added.')


  else:
      batch_job_helper = client.GetBatchJobHelper(version='v201809')
  # Create a BatchJob.
      batch_job = AddBatchJob(client)
  # Retrieve the URL used to upload the BatchJob operations.
      upload_url = batch_job['uploadUrl']['url']
      batch_job_id = batch_job['id']
      print ('Created BatchJob with ID "%d", status "%s", and upload URL "%s"' % (
         batch_job['id'], batch_job['status'], upload_url))

      budget_operations = BuildBudgetOperations(batch_job_helper)
      campaign_operations = BuildCampaignOperations(
        client, batch_job_helper, budget_operations, email, number_of_campaigns)
      campaign_criterion_operations = BuildCampaignCriterionOperations(
        campaign_operations)
      adgroup_operations = BuildAdGroupOperations(
        batch_job_helper, campaign_operations, email, number_of_adgroups)
      adgroup_criterion_operations = BuildAdGroupCriterionOperations(
        adgroup_operations, number_of_keywords)
      adgroup_ad_operations = BuildAdGroupAdOperations(adgroup_operations, client, url, description, titre, email)
     # Upload operations.
      batch_job_helper.UploadOperations(
        upload_url, budget_operations, campaign_operations,
        campaign_criterion_operations, adgroup_operations,
        adgroup_criterion_operations, adgroup_ad_operations)

    # Download and display results.
      download_url = GetBatchJobDownloadUrlWhenReady(client, batch_job_id)
      response = urlopen(download_url).read()
      PrintResponse(batch_job_helper, response)
      #campagne = getCampaign(client, email)
      #addNumber(client, campagne, email)






def AddBatchJob(client):
  """Add a new BatchJob to upload operations to.
  Args:
    client: an instantiated AdWordsClient used to retrieve the BatchJob.
  Returns:
    The new BatchJob created by the request.
  """
  # Initialize appropriate service.
  batch_job_service = client.GetService('BatchJobService', version='v201809')
  # Create a BatchJob.
  batch_job_operations = [{
      'operand': {},
      'operator': 'ADD'
  }]
  return batch_job_service.mutate(batch_job_operations)['value'][0]


def BuildAdGroupAdOperations(adgroup_operations, client, url, description, titre, email):
  """Builds the operations adding an ExpandedTextAd to each AdGroup.
  Args:
    adgroup_operations: a list containing the operations that will add AdGroups.
  Returns:
    a list containing the operations that will create a new ExpandedTextAd for
    each of the provided AdGroups.
  """
  print(description)
  adgroup_ad_operations = [
      {
          # The xsi_type of the operation can usually be guessed by the API
          # because a given service only handles one type of operation.
          # However, batch jobs process operations of different types, so
          # the xsi_type must always be explicitly defined for these
          # operations.
          'xsi_type': 'AdGroupAdOperation',
          'operand': {
              'adGroupId': adgroup_operation['operand']['id'],
              'ad': {
                   'xsi_type': 'MultiAssetResponsiveDisplayAd',
      'headlines': [{
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': titre
          }
      }],
      'descriptions': [{
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': description
          }

      }],
      'businessName': "Le comparateur",
      'longHeadline': {
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': 'Comparateur de titre.',
          }
      },
      # This ad format does not allow the creation of an image asset by setting
      # the asset.imageData field. An image asset must first be created using
      # the AssetService, and asset.assetId must be populated when creating
      # the ad.
      'marketingImages': [{
          'asset': {
              'xsi_type': 'ImageAsset',
              'assetId': UploadImageAsset(client, url)
          }
      }],
      'squareMarketingImages': [{
          'asset': {
              'xsi_type': 'ImageAsset',
              'assetId': UploadImageAsset(client, 'http://137.74.199.121/static/ads/3.jpg')
          }
      }],
      # Optional values
      'finalUrls': ['https://sn.comparez.co'],
      'callToActionText': 'Shop Now',
      # Set color settings using hexadecimal values. Set allowFlexibleColor to
      # false if you want your ads to render by always using your colors
      # strictly.
      'mainColor': '#0000ff',
      'accentColor': '#ffff00',
      'allowFlexibleColor': False,
      'formatSetting': 'NON_NATIVE',
      # Set dynamic display ad settings, composed of landscape logo image,
      # promotion text, and price prefix.
      'dynamicSettingsPricePrefix': 'as low as',
      'dynamicSettingsPromoText': 'Livraison gratuite!',
      'logoImages': [{
          'asset': {
              'xsi_type': 'ImageAsset',
              'assetId': UploadImageAsset(client, 'http://137.74.199.121/static/ads/2.jpg')
          }
      }]
              }
          },
          'operator': 'ADD'
      }
      for adgroup_operation in adgroup_operations]

  return adgroup_ad_operations


def BuildAdGroupCriterionOperations(adgroup_operations, number_of_keywords=1):
  """Builds the operations adding a Keyword Criterion to each AdGroup.
  Args:
    adgroup_operations: a list containing the operations that will add AdGroups.
    number_of_keywords: an int defining the number of Keywords to be created.
  Returns:
    a list containing the operations that will create a new Keyword Criterion
    associated with each provided AdGroup.
  """

  sites = ['www.seneweb.com', 'www.senego.com']
  ages = [503002, 503003, 503004, 503005]
  gender = [11, 20]
  criterion_operations = [
      {
          # The xsi_type of the operation can usually be guessed by the API
          # because a given service only handles one type of operation.
          # However, batch jobs process operations of different types, so
          # the xsi_type must always be explicitly defined for these
          # operations.
          'xsi_type': 'AdGroupCriterionOperation',
          'operand': {
              'xsi_type': 'BiddableAdGroupCriterion',
              'adGroupId': adgroup_operation['operand']['id'],
              'criterion': {
                  'xsi_type': 'Keyword',
                  # Make 50% of keywords invalid to demonstrate error handling.
                  'text': 'comparez%s%s' % (i, '!!!' if i % 2 == 0 else ''),
                  'matchType': 'BROAD'
              },
              'criterion': {

                  'xsi_type': 'Placement',
                  'url': site

              },

          },

          'operator': 'ADD'
      }


      for adgroup_operation in adgroup_operations
      for site in sites
      for age in ages
      for genre in gender
      for i in range(number_of_keywords)]

  return criterion_operations


def BuildAdGroupOperations(batch_job_helper,
                           campaign_operations, email, number_of_adgroups=1):
  """Builds the operations adding desired number of AdGroups to given Campaigns.
  Note: When the AdGroups are created, they will have a different Id than those
  generated here as a temporary Id. This is just used to identify them in the
  BatchJobService.
  Args:
    batch_job_helper: a BatchJobHelper instance.
    campaign_operations: a list containing the operations that will add
      Campaigns.
    number_of_adgroups: an int defining the number of AdGroups to be created per
      Campaign.
  Returns:
    a list containing the operations that will add the desired number of
    AdGroups to each of the provided Campaigns.
  """
  adgroup_operations = [
      {
          # The xsi_type of the operation can usually be guessed by the API
          # because a given service only handles one type of operation.
          # However, batch jobs process operations of different types, so
          # the xsi_type must always be explicitly defined for these
          # operations.
          'xsi_type': 'AdGroupOperation',
          'operand': {
              'campaignId': campaign_operation['operand']['id'],
              'id': batch_job_helper.GetId(),
              'name': email,
              'biddingStrategyConfiguration': {
                  'bids': [
                      {
                          'xsi_type': 'CpcBid',
                          'bid': {
                              'microAmount': 10000000
                          }
                      }
                  ]
              }
          },
          'operator': 'ADD'
      }
      for campaign_operation in campaign_operations
      for _ in range(number_of_adgroups)]

  return adgroup_operations


def BuildBudgetOperations(batch_job_helper):
  """Builds the operations needed to create a new Budget.
  Note: When the Budget is created, it will have a different Id than the one
  generated here as a temporary Id. This is just used to identify it in the
  BatchJobService.
  Args:
    batch_job_helper: a BatchJobHelper instance.
  Returns:
    a list containing the operation that will create a new Budget.
  """
  # A list of operations creating a Budget.
  budget_operations = [{
      # The xsi_type of the operation can usually be guessed by the API because
      # a given service only handles one type of operation. However, batch jobs
      # process operations of different types, so the xsi_type must always be
      # explicitly defined for these operations.
      'xsi_type': 'BudgetOperation',
      'operand': {
          'name': 'Budget comparez #%s' % uuid.uuid4(),
          # This is a temporary Id used by the BatchJobService to identify the
          # Budget for operations that require a budgetId.
          'budgetId': batch_job_helper.GetId(),
          'amount': {
              'microAmount': '50000000'
          },
          'deliveryMethod': 'STANDARD'
      },
      'operator': 'ADD'
  }]

  return budget_operations


def BuildCampaignCriterionOperations(campaign_operations):
  """Builds the operations needed to create Negative Campaign Criterion.
  Args:
    campaign_operations: a list containing the operations that will add
      Campaigns.
  Returns:
    a list containing the operations that will create a new Negative Campaign
    Criterion associated with each provided Campaign.
  """
  criterion_operations = [
      {
          # The xsi_type of the operation can usually be guessed by the API
          # because a given service only handles one type of operation.
          # However, batch jobs process operations of different types, so
          # the xsi_type must always be explicitly defined for these
          # operations.
          'xsi_type': 'CampaignCriterionOperation',
          'operand': {
              'xsi_type': 'NegativeCampaignCriterion',
              'campaignId': campaign_operation['operand']['id'],
              'criterion': {
                  'xsi_type': 'Keyword',
                  'matchType': 'BROAD',
                  'text': 'comparateur'
              }
          },
          'operator': 'ADD'
      }
      for campaign_operation in campaign_operations]

  return criterion_operations


def getCampaign(client, email):

  campaign_service = client.GetService('CampaignService', version='v201809')
  result = None
  response = ""
  query = (adwords.ServiceQueryBuilder()
            .Select('Id', 'Name', 'Status')
            .Where('Name').EqualTo(email) #ENABLED
            .OrderBy('Name')
            .Limit(0, PAGE_SIZE)
            .Build())

  Page = query.Pager(campaign_service)
  for page in Page:

      # Display results.
      if 'entries' in page:
        for campaign in page['entries']:
          response = campaign['id']
          if str(response).isdigit():
            result = response
          else:
            result = result
          #print ('Campaign with id "%s", name "%s", and status "%s" was '
           #     'found.' % (campaign['id'], campaign['name'],
             #               campaign['status']))
      else:
        result = result
  return result

def AdGroupId(client, campagne__id):
      result = None
      if campagne__id != "None":
        ad_group_service = client.GetService('AdGroupService', version='v201809')
        offset = 0
        selector = {
            'fields': ['Id', 'Name', 'Status'],
            'predicates': [
                {
                    'field': 'CampaignId',
                    'operator': 'EQUALS',
                    'values': [campagne__id]
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
              result = ad_group['id']
                  #print ('Ad group with name "%s", id "%s" and status "%s" was '
                  #      'found.' % (ad_group['name'], ad_group['id'],
                    #                 ad_group['status']))
          else:
            result = result
          offset += PAGE_SIZE
          selector['paging']['startIndex'] = str(offset)
          more_pages = offset < int(page['totalNumEntries'])
      else:
        result = result

      return result

def addNumber(client, campagne__id, email):
  campaign_extension_setting_service = client.GetService(
      'CampaignExtensionSettingService', version='v201809')
  call_feed_item = {
    'xsi_type': 'CallFeedItem',
    'callCountryCode': 'SN',
    'callPhoneNumber': email
  }

  campaign_extension_setting = {
    'campaignId': campagne__id,
    'extensionType': 'CALL',
    'extensionSetting': {
        'extensions': [call_feed_item]
    }
  }

  operation = {
      'operator': 'ADD',
      'operand': campaign_extension_setting
  }
  response = campaign_extension_setting_service.mutate([operation])
  if 'value' in response:
    print ('Extension setting with type "%s" was added to campaignId "%d".' %
           (response['value'][0]['extensionType'],
            response['value'][0]['campaignId']))
  else:
    raise errors.GoogleAdsError('No extension settings were added.')





def BuildCampaignOperations(client, batch_job_helper,
                            budget_operations, email, number_of_campaigns=1):
  """Builds the operations needed to create a new Campaign.
  Note: When the Campaigns are created, they will have a different Id than those
  generated here as a temporary Id. This is just used to identify them in the
  BatchJobService.
  Args:
    batch_job_helper: a BatchJobHelper instance.
    budget_operations: a list containing the operation that will add the budget
      used by these Campaigns.
    number_of_campaigns: an int number defining the number of campaigns to be
      created.
  Returns:
    a list containing the operations to create the desired number of Campaigns.
  """
  # Grab the temporary budgetId to associate with the new Campaigns.
  budget_id = budget_operations[0]['operand']['budgetId']
  call_feed_item = {
    'xsi_type': 'CallFeedItem',
    'callCountryCode': 'SN',
    'callPhoneNumber': email
  }

  campaign_operations = [
      {
          # The xsi_type of the operation can usually be guessed by the API
          # because a given service only handles one type of operation.
          # However, batch jobs process operations of different types, so
          # the xsi_type must always be explicitly defined for these
          # operations.
          'xsi_type': 'CampaignOperation',
          'operand': {
              'name': email,
              # Recommendation: Set the campaign to PAUSED when creating it to
              # stop the ads from immediately serving. Set to ENABLED once
              # you've added targeting and the ads are ready to serve.
              'status': 'PAUSED',
              # This is a temporary Id used by the BatchJobService to identify
              # the Campaigns for operations that require a campaignId.
              'id': batch_job_helper.GetId(),
              'advertisingChannelType': 'SEARCH',
              # Note that only the budgetId is required
              'budget': {
                  'budgetId': budget_id
              },
              'biddingStrategyConfiguration': {
                  'biddingStrategyType': 'MANUAL_CPC'
              },
          },
          'operator': 'ADD'
      }
      for _ in range(number_of_campaigns)]


  return campaign_operations


def GetBatchJob(client, batch_job_id):
  """Retrieves the BatchJob with the given id.
  Args:
    client: an instantiated AdWordsClient used to retrieve the BatchJob.
    batch_job_id: a long identifying the BatchJob to be retrieved.
  Returns:
    The BatchJob associated with the given id.
  """
  batch_job_service = client.GetService('BatchJobService', 'v201809')

  selector = {
      'fields': ['Id', 'Status', 'DownloadUrl'],
      'predicates': [
          {
              'field': 'Id',
              'operator': 'EQUALS',
              'values': [batch_job_id]
          }
      ]
  }

  return batch_job_service.get(selector)['entries'][0]


def GetBatchJobDownloadUrlWhenReady(client, batch_job_id,
                                    max_poll_attempts=MAX_POLL_ATTEMPTS):
  """Retrieves the downloadUrl when the BatchJob is complete.
  Args:
    client: an instantiated AdWordsClient used to poll the BatchJob.
    batch_job_id: a long identifying the BatchJob to be polled.
    max_poll_attempts: an int defining the number of times the BatchJob will be
      checked to determine whether it has completed.
  Returns:
    A str containing the downloadUrl of the completed BatchJob.
  Raises:
    Exception: If the BatchJob hasn't finished after the maximum poll attempts
      have been made.
  """
  batch_job = GetBatchJob(client, batch_job_id)
  poll_attempt = 0
  while (poll_attempt in range(max_poll_attempts) and
         batch_job['status'] in PENDING_STATUSES):
    sleep_interval = (30 * (2 ** poll_attempt) +
                      (random.randint(0, 10000) / 1000))
    print ('Batch Job not ready, sleeping for %s seconds.' % sleep_interval)
    time.sleep(sleep_interval)
    batch_job = GetBatchJob(client, batch_job_id)
    poll_attempt += 1

    if 'downloadUrl' in batch_job:
      url = batch_job['downloadUrl']['url']
      print ('Batch Job with Id "%s", Status "%s", and DownloadUrl "%s" ready.'
             % (batch_job['id'], batch_job['status'], url))
      return url
  raise Exception('Batch Job not finished downloading. Try checking later.')


def PrintResponse(batch_job_helper, response_xml):
  """Prints the BatchJobService response.
  Args:
    batch_job_helper: a BatchJobHelper instance.
    response_xml: a string containing a response from the BatchJobService.
  """
  response = batch_job_helper.ParseResponse(response_xml)

  if 'rval' in response['mutateResponse']:
    for data in response['mutateResponse']['rval']:
      if 'errorList' in data:
        print(data['errorList'])
        print ('Operation %s - FAILURE:' % data['index'])
        print ('\terrorType=%s' % data['errorList']['errors']['ApiError.Type'])
        print ('\ttrigger=%s' % data['errorList']['errors']['trigger'])
        print ('\terrorString=%s' % data['errorList']['errors']['errorString'])
        print ('\tfieldPath=%s' % data['errorList']['errors']['fieldPath'])
        print ('\treason=%s' % data['errorList']['errors']['reason'])
      if 'result' in data:
        print ('Operation %s - SUCCESS.' % data['index'])