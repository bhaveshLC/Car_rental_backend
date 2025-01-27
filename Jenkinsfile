pipeline {
    agent any
    tools {
        nodejs '20.7.0'  // Ensure Node.js version 20.17.0 is used
    }
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm  // Check out the source code from the Git repository
            }
        }
        stage('Print Versions') {
            steps {
                sh 'npm version'  // Print the npm version and other relevant details
            }
        }
        stage('Install') {
            steps {
                // Force install dependencies even with conflicts
                sh 'npm install --force'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'  // Run the build command
            }
        }
    }
}
