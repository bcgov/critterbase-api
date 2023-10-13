FROM quay.io/fedora/postgresql-15

# This is our time zone
ENV TZ America/Vancouver

# install PostGIS
RUN sudo dnf update
RUN sudo dnf install -y --no-install-recommends postgresql-15-postgis-3
RUN sudo dnf install -y --no-install-recommends postgresql-15-postgis-3-dbgsym
RUN sudo dnf install -y --no-install-recommends postgresql-15-postgis-3-scripts

# Set the time zone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Load the PostGIS extension into the database
COPY load_postgis.sql docker-entrypoint-initdb.d/load_postgis.sql

EXPOSE 5432
