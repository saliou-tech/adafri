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

"""This example adds a responsive display ad to a given ad group.

To get ad_group_id, run get_ad_groups.py.

The LoadFromStorage method is pulling credentials and properties from a
"googleads.yaml" file. By default, it looks for this file in your home
directory. For more information, see the "Caching authentication information"
section of our README.

"""

from urllib.request import build_opener, Request, urlopen
from requests_html import HTMLSession
import gzip
from googleads import adwords


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


def add_responsive_display_ad(client, ad_group_id, url, name, description, businessName):
  # Initialize appropriate services.
  ad_group_ad_service = client.GetService('AdGroupAdService', version='v201809')
  media_service = client.GetService('MediaService', version='v201809')
  opener = build_opener(*client.proxy_config.GetHandlers())


  try:
    # Create marketing image.
    marketing_image = _CreateImage(media_service, opener,
                                   url)

    # Create square marketing image.
    square_marketing_image = UploadImageAsset(client, 'https://goo.gl/mtt54n')
    """     responsive_display = {
                'xsi_type': 'ResponsiveDisplayAd',
                'marketingImage': {'mediaId': UploadImageAsset(client, url)},
                'shortHeadline': 'Travel',
                'longHeadline': 'Travel the World',
                'description': 'Take to the air!',
                'businessName': 'Interplanetary Cruises',
                'finalUrls': ['http://www.example.com'],
                # Optional: Set a square marketing image to the ad.
                'squareMarketingImage': {
                    'mediaId': square_marketing_image['mediaId']
                },
                # Optional: Set call-to-action text.
                'callToActionText': 'Shop Now',
                # Optional: Set dynamic display ad settings, composed of
                # landscape logo image, promotion text, and price prefix.
                'dynamicDisplayAdSettings': UploadImageAsset(client, url),
                # Whitelisted accounts only: Set color settings using
                # hexadecimal numbers.
                # Set allowFlexibleColor to False if you want your ads to render
                # by always using your colors strictly.
                # 'mainColor': '#0000ff',
                # 'accentColor': '#ffff00',
                # 'allowFlexibleColor': False
                # Whitelisted accounts only: Set the format setting that the ad
                # will be served in.
                # 'formatSetting': 'NON_NATIVE'
    }
    ad_group_ad = { 
      'adGroupId': ad_group_id,
      'ad': responsive_display,
      # Optional.
      'status': 'PAUSED'
  }

  # Add ad.
    ads = ad_group_ad_service.mutate([
      {'operator': 'ADD', 'operand': ad_group_ad}
    ]) """
    # Create a responsive display ad.
    operations = [{
        'operator': 'ADD',
        'operand': {
            'xsi_type': 'AdGroupAd',
            'adGroupId': ad_group_id,
            'ad': {
          'xsi_type': 'MultiAssetResponsiveDisplayAd',
          'headlines': [{
          'asset': {
              'xsi_type': 'TextAsset',
              'assetText': name
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
              'assetText': businessName,
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

            },
            # Optional fields.
            'status': 'PAUSED'
        }
    }]

    # Make the mutate request.
    ads = ad_group_ad_service.mutate(operations)

    # Display results.
    for ad in ads['value']:
      print ('ResponsiveDisplayAd with id "%d" and short headline "%s" was '
             'added.' % (ad['ad']['id'], ad['ad']['headlines']))

  except Exception as e:
    print(e)
    #raise Exception('Failed to create responsive display ad.')


def _CreateImage(media_service, opener, url):
  """Creates an image and uploads it to the server.

  Args:
    media_service: a SudsServiceProxy instance for AdWords's MediaService.
    opener: an OpenerDirector instance.
    url: a str URL used to load image data.

  Returns:
    The image that was successfully uploaded.
  """
  # Note: The utf-8 decode is for 2to3 Python 3 compatibility.
  #image_data = urlopen(Request(url)).read()
  headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }
  session = HTMLSession()
  image_request = session.get(url, headers=headers, verify=True)
  print(image_request.html)
  image = {
      'type': 'IMAGE',
      'data': image_request.content,
      'xsi_type': 'Image'
  }
  

  return media_service.upload(image)[0]


def _CreateDynamicDisplayAdSettings(media_service, opener, url):
  """Creates settings for dynamic display ad.

  Args:
    media_service: a SudsServiceProxy instance for AdWords's MediaService.
    opener: an OpenerDirector instance.

  Returns:
    The dynamic display ad settings.
  """
  image = _CreateImage(media_service, opener, url)

  logo = {
      'type': 'IMAGE',
      'mediaId': image['mediaId'],
      'xsi_type': 'Image'
  }

  dynamic_settings = {
      'landscapeLogoImage': logo,
      'pricePrefix': 'as low as',
      'promoText': 'Free shipping!',
      'xsi_type': 'DynamicSettings',
  }

  return dynamic_settings





