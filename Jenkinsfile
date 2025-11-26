pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        NPM_CONFIG_LOGLEVEL = 'error'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                echo 'Setting up Node.js environment...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running linter...'
                sh 'npm run lint || true'
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
            }
        }

        stage('Frontend Tests') {
            steps {
                echo 'Running frontend tests...'
                sh 'npm run test:frontend'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/**/*.xml'
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Coverage Report'
                    ])
                }
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Running backend tests...'
                sh 'npm run test:backend'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/**/*.xml'
                }
            }
        }

        stage('E2E Tests') {
            steps {
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install --with-deps chromium'
                
                echo 'Running E2E tests...'
                sh 'npm run test:e2e'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/**/*.xml'
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'E2E Test Report'
                    ])
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('Test Summary') {
            steps {
                echo 'All tests completed!'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'rm -rf node_modules/.cache || true'
        }
        success {
            echo 'Pipeline succeeded! ✅'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
        unstable {
            echo 'Pipeline unstable! ⚠️'
        }
    }
}


