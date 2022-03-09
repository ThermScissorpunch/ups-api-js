import { getXMLHeader, xmlToJson } from "./util";

export const LocatorAPI = superclass =>
    class extends superclass {
        async getNearestAccessPoint(addressLine, city, postalCode, countryCode, options = {}) {
            const data = this._buildNearestAccessPointPayload(
                addressLine,
                city,
                postalCode,
                countryCode,
                options
            );
            const response = await this.post(this._getLocatorBaseUrl(), {
                kwargs: { auth: "headers" },
                mime: "application/xml",
                data: data,
                ...options
            });
            const xml = await response.text();
            const result = xmlToJson(xml);
            return result;
        }

        _buildNearestAccessPointPayload(
            addressLine,
            city,
            postalCode,
            countryCode,
            { consignee = null, locale = "en_US", metric = true, radius = 150 } = {}
        ) {
            const xml =
                getXMLHeader(this.username, this.password, this.license) +
                `<?xml version="1.0"?>
                <LocatorRequest xml:lang="en-US">
                  <Request>
                  <RequestAction>Locator</RequestAction>
                  <RequestOption>64</RequestOption>
                </Request>
                <OriginAddress>
                <AddressKeyFormat>
                <CountryCode>${countryCode}</CountryCode>
                <PostcodePrimaryLow>${postalCode}</PostcodePrimaryLow>
                <AddressLine>${postalCode}</AddressLine>
                </AddressKeyFormat>
                </OriginAddress>
                <Translate>
                  <Locale>${locale}</Locale>
                </Translate>
                <UnitOfMeasurement>
                  <Code>KM</Code>
                </UnitOfMeasurement>
                <LocationSearchCriteria>
                  <SearchOption>
                  <OptionType>
                  <Code>01</Code>
                  </OptionType>
                  <OptionCode>
                  <Code>018</Code>
                  </OptionCode>
                  </SearchOption>
                  <MaximumListSize>30</MaximumListSize>
                  <SearchRadius>50</SearchRadius>
                  </LocationSearchCriteria>
                </LocatorRequest>`;
            return xml;
        }
    };
