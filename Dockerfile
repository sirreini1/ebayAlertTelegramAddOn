# Use the official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Update apt-get before install
RUN apt-get update -y && apt-get upgrade -y

# Install dependencies
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0
RUN apt-get install -y libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# Install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb || apt-get install -fy

# Remove downloaded deb file
RUN rm google-chrome-stable_current_amd64.deb

# Copy the rest of the application files to the container
COPY . .

